import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { RouterNames } from '../utils/express/RouterNames'

export function getRouterFactoryAst(operations: EnhancedOperation[], context: OpenAPIGeneratorContext) {
  return factory.createFunctionDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    factory.createIdentifier(context.nameOf(context.document, 'oats/express-context-handler-factory')),
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(RouterNames.api),
        undefined,
        factory.createTypeReferenceNode(context.referenceOf(context.document, 'oats/api-type')),
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
    ],
    factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Handler), undefined),
    factory.createBlock(
      [
        factory.createReturnStatement(
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
                factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Request), undefined),
                undefined,
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier(RouterNames.response),
                undefined,
                factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Response), undefined),
                undefined,
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier(RouterNames.next),
                undefined,
                factory.createTypeReferenceNode(
                  factory.createIdentifier(RuntimePackages.Express.NextFunction),
                  undefined,
                ),
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
                      factory.createStringLiteral(RouterNames.apiKey(context.hashOf(context.document))),
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
                      factory.createStringLiteral(RouterNames.adapterKey(context.hashOf(context.document))),
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
        ),
      ],
      true,
    ),
  )
}
