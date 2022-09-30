import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { RouterNames } from '../utils/express/RouterNames'

export function getRouterFactoryAst(operations: EnhancedOperation[], context: OpenAPIGeneratorContext) {
  const { nameOf, referenceOf, document } = context
  const factoriesAst = factory.createArrayLiteralExpression(
    operations.map(({ operation }) => {
      return factory.createBinaryExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(RouterNames.routes),
          context.nameOf(operation, 'oats/express-router'),
        ),
        factory.createToken(SyntaxKind.QuestionQuestionToken),
        referenceOf(operation, 'oats/express-router'),
      )
    }),
  )

  const routerAst = factory.createBinaryExpression(
    factory.createIdentifier(RouterNames.router),
    SyntaxKind.QuestionQuestionToken,
    factory.createCallExpression(factory.createIdentifier(RuntimePackages.Express.Router), [], []),
  )

  const reducerFnAst = factory.createArrowFunction(
    undefined,
    undefined,
    [
      factory.createParameterDeclaration(undefined, undefined, undefined, factory.createIdentifier('r')),
      factory.createParameterDeclaration(undefined, undefined, undefined, factory.createIdentifier('f')),
    ],
    undefined,
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    factory.createCallExpression(factory.createIdentifier('f'), undefined, [factory.createIdentifier('r')]),
  )

  return factory.createFunctionDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    factory.createIdentifier(nameOf(document, 'oats/express-router-factory')),
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
            factory.createPropertyAccessExpression(factoriesAst, factory.createIdentifier('reduce')),
            undefined,
            [reducerFnAst, routerAst],
          ),
        ),
      ],
      true,
    ),
  )
}
