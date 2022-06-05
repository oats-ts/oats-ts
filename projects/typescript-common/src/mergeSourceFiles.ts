import { SourceFile } from 'typescript'
import {
  factory,
  ImportClause,
  ImportDeclaration,
  NamedImportBindings,
  NamedImports,
  StringLiteral,
  SyntaxKind,
} from 'typescript'
import { flatMap, groupBy, head, sortBy, uniqBy, values } from 'lodash'
import { createSourceFile } from './createSourceFile'
import { getStatements } from './getStatements'
import { getImportDeclarations } from './getImportDeclarations'

function mergeNamedImportBindings(bindings: NamedImportBindings[]): NamedImports {
  const specifiers = sortBy(
    uniqBy(
      flatMap(
        bindings.filter(({ kind }) => kind === SyntaxKind.NamedImports),
        (imports: NamedImports) => {
          return Array.from(imports.elements)
        },
      ),
      (specifier) => specifier.name.text,
    ),
    (specifier) => specifier.name.text,
  )
  return factory.createNamedImports(specifiers)
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
  const mergedImports = Array.from(byModuleSpecifier).map((declarations: ImportDeclaration[]) =>
    factory.createImportDeclaration(
      [],
      [],
      mergeImportClauses(declarations.map(({ importClause }) => importClause)),
      head(declarations).moduleSpecifier,
    ),
  )
  return mergedImports.sort((imp1, imp2) => {
    const imp1Path = (imp1.moduleSpecifier as StringLiteral).text
    const imp2Path = (imp2.moduleSpecifier as StringLiteral).text
    const imp1Local = imp1Path.startsWith('.')
    const imp2Local = imp2Path.startsWith('.')
    if (imp1Local && !imp2Local) {
      return 1
    } else if (imp2Local && !imp1Local) {
      return -1
    }
    return imp1Path.localeCompare(imp2Path)
  })
}

export function mergeSourceFiles(input: SourceFile[]): SourceFile[] {
  return Array.from(values(groupBy(input, (unit) => unit.fileName))).map((units: SourceFile[]): SourceFile => {
    const imports = mergeImportDeclarations(flatMap(units, (file) => getImportDeclarations(file)))
    const statements = flatMap(units, (file) => getStatements(file))
    const path = head(units).fileName
    return createSourceFile(path, imports, statements)
  })
}
