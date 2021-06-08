import {
  identifier,
  importDeclaration,
  ImportDeclaration,
  importSpecifier,
  ImportSpecifier,
  isIdentifier,
  isImportSpecifier,
  stringLiteral,
} from '@babel/types'
import { flatMap, groupBy, head, uniqueBy } from '../../utils'
import { TypeScriptUnit } from '../types/TypeScriptUnit'

function cloneImportSpecifiers(imps: ImportSpecifier[]): ImportSpecifier[] {
  return uniqueBy(
    imps.map((imp) =>
      importSpecifier(
        identifier(imp.local.name),
        isIdentifier(imp.imported) ? identifier(imp.imported.name) : stringLiteral(imp.imported.value),
      ),
    ),
    (imp) => imp.local.name,
  )
}

function mergeImports(imps: ImportDeclaration[]): ImportDeclaration[] {
  return Array.from(groupBy(imps, (imp) => imp.source.value).values()).map((imps): ImportDeclaration => {
    return importDeclaration(
      cloneImportSpecifiers(
        flatMap(imps, (imp) => imp.specifiers.filter((impSpec) => isImportSpecifier(impSpec)) as ImportSpecifier[]),
      ),
      stringLiteral(head(imps).source.value),
    )
  })
}

export function mergeUnits(units: TypeScriptUnit[]): TypeScriptUnit[] {
  return Array.from(groupBy(units, (unit) => unit.path).values()).map(
    (units): TypeScriptUnit => ({
      content: flatMap(units, (unit) => unit.content),
      imports: mergeImports(flatMap(units, (unit) => unit.imports)),
      path: head(units).path,
    }),
  )
}
