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

function mergeNamedImportBindings(bindings: NamedImportBindings[]): NamedImports {
  const specifiers = flatMap(
    bindings.filter(({ kind }) => kind === SyntaxKind.NamedImports),
    (imports: NamedImports) => {
      return Array.from(imports.elements)
    },
  )
  return factory.createNamedImports(uniqBy(specifiers, (specifier) => specifier.name.text))
}

function mergeImportClauses(clauses: ImportClause[]): ImportClause {
  return factory.createImportClause(
    false,
    undefined,
    mergeNamedImportBindings(clauses.map(({ namedBindings }) => namedBindings)),
  )
}

function mergeImportDeclarations(declarations: ImportDeclaration[]): ImportDeclaration[] {
  const byModuleSpecifier = values(
    groupBy(declarations, (declaration) => (declaration.moduleSpecifier as StringLiteral).text),
  )
  return Array.from(byModuleSpecifier).map((declarations: ImportDeclaration[]) =>
    factory.createImportDeclaration(
      [],
      [],
      mergeImportClauses(declarations.map(({ importClause }) => importClause)),
      head(declarations).moduleSpecifier,
    ),
  )
}

export function tsMergeModules(units: TypeScriptModule[]): TypeScriptModule[] {
  return Array.from(values(groupBy(units, (unit) => unit.path))).map(
    (units: TypeScriptModule[]): TypeScriptModule => ({
      statements: flatMap(units, (unit) => unit.statements),
      imports: mergeImportDeclarations(flatMap(units, (unit) => unit.imports)),
      path: head(units).path,
    }),
  )
}
