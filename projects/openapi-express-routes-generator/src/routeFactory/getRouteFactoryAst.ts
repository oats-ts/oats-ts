import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { ExpressRouteGeneratorConfig } from '..'
import { Names } from '../Names'

export function getMainRouteFactoryAst(
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ExpressRouteGeneratorConfig,
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
        factory.createIdentifier(Names.api),
        undefined,
        factory.createTypeReferenceNode(referenceOf(document, 'openapi/api-type'), [
          factory.createTypeReferenceNode(RuntimePackages.HttpServerExpress.ExpressParameters),
        ]),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(Names.configuration),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.HttpServer.ServerConfiguration), [
          factory.createTypeReferenceNode(
            factory.createIdentifier(RuntimePackages.HttpServerExpress.ExpressParameters),
            undefined,
          ),
        ]),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(Names.routes),
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
                    factory.createIdentifier(Names.response),
                    undefined,
                    undefined,
                    undefined,
                  ),
                  factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    factory.createIdentifier(Names.next),
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
                            factory.createIdentifier(Names.response),
                            factory.createIdentifier(Names.locals),
                          ),
                          factory.createStringLiteral(config.apiImplKey),
                        ),
                        factory.createToken(SyntaxKind.EqualsToken),
                        factory.createIdentifier(Names.api),
                      ),
                    ),
                    factory.createExpressionStatement(
                      factory.createBinaryExpression(
                        factory.createElementAccessExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier(Names.response),
                            factory.createIdentifier(Names.locals),
                          ),
                          factory.createStringLiteral(config.configurationKey),
                        ),
                        factory.createToken(SyntaxKind.EqualsToken),
                        factory.createIdentifier(Names.configuration),
                      ),
                    ),
                    factory.createExpressionStatement(
                      factory.createCallExpression(factory.createIdentifier(Names.next), undefined, []),
                    ),
                  ],
                  true,
                ),
              ),
              ...operations.map(({ operation }) => {
                return factory.createBinaryExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(Names.routes),
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
