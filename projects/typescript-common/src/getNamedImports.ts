import { factory, ImportDeclaration } from 'typescript'
import { GeneratorContext } from '@oats-ts/model-common'

export function getNamedImports(from: string, names: string[], context?: GeneratorContext): ImportDeclaration {
  return factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports(
        names.map((originalName) => {
          const asName = context?.exportOf(from, originalName) ?? originalName
          if (asName === originalName) {
            return factory.createImportSpecifier(false, undefined, factory.createIdentifier(originalName))
          }
          return factory.createImportSpecifier(
            false,
            factory.createIdentifier(originalName),
            factory.createIdentifier(asName),
          )
        }),
      ),
    ),
    factory.createStringLiteral(from),
  )
}
