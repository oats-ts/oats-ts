import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'

export function getRoutersTypeAst(operations: EnhancedOperation[], context: OpenAPIGeneratorContext) {
  return factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    context.nameOf(context.document, 'oats/express-routers-type'),
    undefined,
    factory.createTypeLiteralNode(
      operations.map((operation) => {
        return factory.createPropertySignature(
          undefined,
          context.nameOf(operation.operation, 'oats/operation'),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Router), undefined),
        )
      }),
    ),
  )
}
