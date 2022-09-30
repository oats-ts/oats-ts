import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { RouterNames } from '../utils/express/RouterNames'

export function getRouterFactoryAst(operations: EnhancedOperation[], context: OpenAPIGeneratorContext) {
  const { nameOf, referenceOf, document } = context
  return factory.createFunctionDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    factory.createIdentifier(nameOf(document, 'oats/express-router-factory')),
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(RouterNames.routes),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('Partial'), [
          referenceOf(document, 'oats/express-routers-type'),
        ]),
        factory.createObjectLiteralExpression([], false),
      ),
    ],
    factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Router), undefined),
    factory.createBlock(
      [
        factory.createReturnStatement(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createCallExpression(factory.createIdentifier(RuntimePackages.Express.Router), undefined, []),
              factory.createIdentifier('use'),
            ),
            undefined,
            [
              ...operations.map(({ operation }) => {
                return factory.createBinaryExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(RouterNames.routes),
                    referenceOf(operation, 'oats/express-router'),
                  ),
                  factory.createToken(SyntaxKind.QuestionQuestionToken),
                  referenceOf(operation, 'oats/express-router'),
                )
              }),
            ],
          ),
        ),
      ],
      true,
    ),
  )
}
