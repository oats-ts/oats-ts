import {
  factory,
  ImportClause,
  ImportDeclaration,
  NamedImportBindings,
  NamedImports,
  StringLiteral,
  SyntaxKind,
} from 'typescript'
import { flatMap, groupBy, head, uniqBy, values } from 'lodash'
import { TypeScriptModule } from '@oats-ts/babel-writer'

function mergeNamedImports(bindings: NamedImportBindings[]): NamedImports {
  return factory.createNamedImports(
    flatMap(
      bindings.filter(({ kind }) => kind === SyntaxKind.NamedImports),
      (imp: NamedImports) => uniqBy(Array.from(imp.elements), (impSpec) => impSpec.name.text),
    ),
  )
}

function mergeImportClauses(imps: ImportClause[]): ImportClause {
  return factory.createImportClause(false, undefined, mergeNamedImports(imps.map((imp) => imp.namedBindings)))
}

function mergeImports(imps: ImportDeclaration[]): ImportDeclaration[] {
  return Array.from(values(groupBy(imps, (imp) => (imp.moduleSpecifier as StringLiteral).text))).map((imps) =>
    factory.createImportDeclaration(
      [],
      [],
      mergeImportClauses(imps.map((imp) => imp.importClause)),
      head(imps).moduleSpecifier,
    ),
  )
}

export function tsMergeModules(units: TypeScriptModule[]): TypeScriptModule[] {
  return Array.from(values(groupBy(units, (unit) => unit.path))).map(
    (units): TypeScriptModule => ({
      statements: flatMap(units, (unit) => unit.statements),
      imports: mergeImports(flatMap(units, (unit) => unit.imports)),
      path: head(units).path,
    }),
  )
}
