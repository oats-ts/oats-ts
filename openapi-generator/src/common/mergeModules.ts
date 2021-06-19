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
import type { BabelModule } from '@oats-ts/babel-writer'
import { flatMap, groupBy, head, uniqBy, values } from 'lodash'

function cloneImportSpecifiers(imps: ImportSpecifier[]): ImportSpecifier[] {
  return uniqBy(
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
  return Array.from(values(groupBy(imps, (imp) => imp.source.value))).map((imps): ImportDeclaration => {
    return importDeclaration(
      cloneImportSpecifiers(
        flatMap(imps, (imp) => imp.specifiers.filter((impSpec) => isImportSpecifier(impSpec)) as ImportSpecifier[]),
      ),
      stringLiteral(head(imps).source.value),
    )
  })
}

export function mergeModules(modules: BabelModule[]): BabelModule[] {
  return Array.from(values(groupBy(modules, (unit) => unit.path))).map(
    (units): BabelModule => ({
      statements: flatMap(units, (unit) => unit.statements),
      imports: mergeImports(flatMap(units, (unit) => unit.imports)),
      path: head(units).path,
    }),
  )
}
