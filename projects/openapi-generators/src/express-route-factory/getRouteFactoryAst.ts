import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { RouterNames } from '../utils/RouterNames'
import { ExpressRouterFactoryGeneratorConfig } from './typings'

export function getMainRouteFactoryAst(
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ExpressRouterFactoryGeneratorConfig,
) {
  const { nameOf, referenceOf, document } = context
  return factory.createFunctionDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    factory.createIdentifier(nameOf(document, 'openapi/express-route-factory')),
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(RouterNames.api),
        undefined,
        factory.createTypeReferenceNode(referenceOf(document, 'openapi/api-type')),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(RouterNames.adapter),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Http.ServerAdapter), [
          factory.createTypeReferenceNode(
            factory.createIdentifier(RuntimePackages.HttpServerExpress.ExpressToolkit),
            undefined,
          ),
        ]),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(RouterNames.routes),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('Partial'), [
          referenceOf(document, 'openapi/express-routes-type'),
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
              factory.createArrowFunction(
                undefined,
                undefined,
                [
                  factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    factory.createIdentifier('_'),
                    undefined,
                    undefined,
                    undefined,
                  ),
                  factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    factory.createIdentifier(RouterNames.response),
                    undefined,
                    undefined,
                    undefined,
                  ),
                  factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    factory.createIdentifier(RouterNames.next),
                    undefined,
                    undefined,
                    undefined,
                  ),
                ],
                undefined,
                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                factory.createBlock(
                  [
                    factory.createExpressionStatement(
                      factory.createBinaryExpression(
                        factory.createElementAccessExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier(RouterNames.response),
                            factory.createIdentifier(RouterNames.locals),
                          ),
                          factory.createStringLiteral(config.apiKey),
                        ),
                        factory.createToken(SyntaxKind.EqualsToken),
                        factory.createIdentifier(RouterNames.api),
                      ),
                    ),
                    factory.createExpressionStatement(
                      factory.createBinaryExpression(
                        factory.createElementAccessExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier(RouterNames.response),
                            factory.createIdentifier(RouterNames.locals),
                          ),
                          factory.createStringLiteral(config.adapterKey),
                        ),
                        factory.createToken(SyntaxKind.EqualsToken),
                        factory.createIdentifier(RouterNames.adapter),
                      ),
                    ),
                    factory.createExpressionStatement(
                      factory.createCallExpression(factory.createIdentifier(RouterNames.next), undefined, []),
                    ),
                  ],
                  true,
                ),
              ),
              ...operations.map(({ operation }) => {
                return factory.createBinaryExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(RouterNames.routes),
                    referenceOf(operation, 'openapi/express-route'),
                  ),
                  factory.createToken(SyntaxKind.QuestionQuestionToken),
                  referenceOf(operation, 'openapi/express-route'),
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
