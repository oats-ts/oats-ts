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
import flatMap from 'lodash/flatMap'
import groupBy from 'lodash/groupBy'
import head from 'lodash/head'
import uniqueBy from 'lodash/uniqBy'
import values from 'lodash/values'

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
  return Array.from(values(groupBy(imps, (imp) => imp.source.value))).map((imps): ImportDeclaration => {
    return importDeclaration(
      cloneImportSpecifiers(
        flatMap(imps, (imp) => imp.specifiers.filter((impSpec) => isImportSpecifier(impSpec)) as ImportSpecifier[]),
      ),
      stringLiteral(head(imps).source.value),
    )
  })
}

export function mergeUnits(units: BabelModule[]): BabelModule[] {
  return Array.from(values(groupBy(units, (unit) => unit.path))).map(
    (units): BabelModule => ({
      statements: flatMap(units, (unit) => unit.statements),
      imports: mergeImports(flatMap(units, (unit) => unit.imports)),
      path: head(units).path,
    }),
  )
}
