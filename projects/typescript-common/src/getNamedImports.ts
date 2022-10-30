import { factory, ImportDeclaration } from 'typescript'

export function getNamedImports(from: string, names: (string | [string, string])[]): ImportDeclaration {
  return factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports(
        names.map((name) => {
          if (Array.isArray(name)) {
            const [original, asName] = name
            return factory.createImportSpecifier(
              false,
              factory.createIdentifier(original),
              factory.createIdentifier(asName),
            )
          }
          return factory.createImportSpecifier(false, undefined, factory.createIdentifier(name))
        }),
      ),
    ),
    factory.createStringLiteral(from),
  )
}
