import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, NodeFlags, Statement, SyntaxKind } from 'typescript'
import { RouterNames } from '../utils/express/RouterNames'

const RouterFactoryNames = {
  root: 'root',
  routers: 'routers',
  uniqueRouters: 'uniqueRouters',
  overrides: 'overrides',
  factories: 'factories',
  childRouter: 'childRouter',
  factory: 'factory',
}

function getRootRouterStatement(): Statement {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(RouterFactoryNames.root),
          undefined,
          undefined,
          factory.createBinaryExpression(
            factory.createIdentifier(RouterNames.router),
            factory.createToken(SyntaxKind.QuestionQuestionToken),
            factory.createCallExpression(factory.createIdentifier(RuntimePackages.Express.Router), undefined, []),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}

function getFactoriesArrayStatement(operations: EnhancedOperation[], context: OpenAPIGeneratorContext): Statement {
  const factoriesArrayAst = factory.createArrayLiteralExpression(
    operations.map(({ operation }) => {
      return factory.createBinaryExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(RouterFactoryNames.overrides),
          context.nameOf(operation, 'oats/express-router'),
        ),
        factory.createToken(SyntaxKind.QuestionQuestionToken),
        context.referenceOf(operation, 'oats/express-router'),
      )
    }),
  )

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(RouterFactoryNames.factories),
          undefined,
          undefined,
          factoriesArrayAst,
        ),
      ],
      NodeFlags.Const,
    ),
  )
}

function getRouterCreationStatement(): Statement {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(RouterFactoryNames.uniqueRouters),
          undefined,
          undefined,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(RouterFactoryNames.factories),
              factory.createIdentifier('reduce'),
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
                    factory.createIdentifier(RouterFactoryNames.routers),
                    undefined,
                    factory.createArrayTypeNode(
                      factory.createTypeReferenceNode(
                        factory.createIdentifier(RuntimePackages.Express.Router),
                        undefined,
                      ),
                    ),
                    undefined,
                  ),
                  factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    undefined,
                    factory.createIdentifier(RouterFactoryNames.factory),
                    undefined,
                    factory.createFunctionTypeNode(
                      undefined,
                      [
                        factory.createParameterDeclaration(
                          undefined,
                          undefined,
                          undefined,
                          factory.createIdentifier(RouterNames.router),
                          factory.createToken(SyntaxKind.QuestionToken),
                          factory.createTypeReferenceNode(
                            factory.createIdentifier(RuntimePackages.Express.Router),
                            undefined,
                          ),
                          undefined,
                        ),
                      ],
                      factory.createTypeReferenceNode(
                        factory.createIdentifier(RuntimePackages.Express.Router),
                        undefined,
                      ),
                    ),
                    undefined,
                  ),
                ],
                factory.createArrayTypeNode(
                  factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Router), undefined),
                ),
                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                factory.createBlock(
                  [
                    factory.createVariableStatement(
                      undefined,
                      factory.createVariableDeclarationList(
                        [
                          factory.createVariableDeclaration(
                            factory.createIdentifier(RouterFactoryNames.childRouter),
                            undefined,
                            undefined,
                            factory.createCallExpression(
                              factory.createIdentifier(RouterFactoryNames.factory),
                              undefined,
                              [factory.createIdentifier(RouterFactoryNames.root)],
                            ),
                          ),
                        ],
                        NodeFlags.Const,
                      ),
                    ),
                    factory.createReturnStatement(
                      factory.createConditionalExpression(
                        factory.createBinaryExpression(
                          factory.createIdentifier(RouterFactoryNames.childRouter),
                          factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
                          factory.createIdentifier(RouterFactoryNames.root),
                        ),
                        factory.createToken(SyntaxKind.QuestionToken),
                        factory.createIdentifier(RouterFactoryNames.routers),
                        factory.createToken(SyntaxKind.ColonToken),
                        factory.createArrayLiteralExpression(
                          [
                            factory.createSpreadElement(factory.createIdentifier(RouterFactoryNames.routers)),
                            factory.createIdentifier(RouterFactoryNames.childRouter),
                          ],
                          false,
                        ),
                      ),
                    ),
                  ],
                  true,
                ),
              ),
              factory.createArrayLiteralExpression([], false),
            ],
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}

function getReturnStatement() {
  return factory.createReturnStatement(
    factory.createConditionalExpression(
      factory.createBinaryExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(RouterFactoryNames.uniqueRouters),
          factory.createIdentifier('length'),
        ),
        factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
        factory.createNumericLiteral(0),
      ),
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createIdentifier(RouterFactoryNames.root),
      factory.createToken(SyntaxKind.ColonToken),
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(RouterFactoryNames.root),
          factory.createIdentifier('use'),
        ),
        undefined,
        [factory.createSpreadElement(factory.createIdentifier(RouterFactoryNames.uniqueRouters))],
      ),
    ),
  )
}

function getParametersAst(context: OpenAPIGeneratorContext) {
  return [
    factory.createParameterDeclaration(
      [],
      [],
      undefined,
      factory.createIdentifier(RouterNames.router),
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Router), undefined),
      undefined,
    ),
    factory.createParameterDeclaration(
      undefined,
      undefined,
      undefined,
      factory.createIdentifier(RouterFactoryNames.overrides),
      undefined,
      factory.createTypeReferenceNode(factory.createIdentifier('Partial'), [
        context.referenceOf(context.document, 'oats/express-routers-type'),
      ]),
      factory.createObjectLiteralExpression([], false),
    ),
  ]
}

export function getRouterFactoryAst(operations: EnhancedOperation[], context: OpenAPIGeneratorContext) {
  return factory.createFunctionDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    factory.createIdentifier(context.nameOf(context.document, 'oats/express-router-factory')),
    undefined,
    getParametersAst(context),
    factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Router), undefined),
    factory.createBlock(
      [
        getRootRouterStatement(),
        getFactoriesArrayStatement(operations, context),
        getRouterCreationStatement(),
        getReturnStatement(),
      ],
      true,
    ),
  )
}
