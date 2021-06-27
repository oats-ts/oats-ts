import { factory, ImportDeclaration } from 'typescript'

export function getNamedImports(from: string, names: string[]): ImportDeclaration {
  return factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports(
        names.map((name) => factory.createImportSpecifier(undefined, factory.createIdentifier(name))),
      ),
    ),
    factory.createStringLiteral(from),
  )
}
