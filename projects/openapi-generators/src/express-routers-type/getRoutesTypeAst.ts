import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { RouterNames } from '../utils/express/RouterNames'

export function getRoutersTypeAst(operations: EnhancedOperation[], context: OpenAPIGeneratorContext) {
  return factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    context.nameOf(context.document, 'oats/express-routers-type'),
    undefined,
    factory.createTypeLiteralNode(
      operations.map((operation) => {
        const fieldType = factory.createFunctionTypeNode(
          undefined,
          [
            factory.createParameterDeclaration(
              [],
              [],
              undefined,
              factory.createIdentifier(RouterNames.router),
              factory.createToken(SyntaxKind.QuestionToken),
              factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Router), undefined),
              undefined,
            ),
          ],
          factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Router), undefined),
        )

        return factory.createPropertySignature(
          undefined,
          context.nameOf(operation.operation, 'oats/express-router'),
          undefined,
          fieldType,
        )
      }),
    ),
  )
}
