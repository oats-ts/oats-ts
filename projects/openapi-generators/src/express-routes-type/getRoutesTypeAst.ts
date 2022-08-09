import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'

export function getRoutesTypeAst(operations: EnhancedOperation[], context: OpenAPIGeneratorContext) {
  const { nameOf, referenceOf, document } = context
  return factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(document, 'oats/express-routes-type'),
    undefined,
    factory.createTypeLiteralNode(
      operations.map((operation) => {
        return factory.createPropertySignature(
          undefined,
          referenceOf(operation.operation, 'oats/express-route'),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Router), undefined),
        )
      }),
    ),
  )
}
