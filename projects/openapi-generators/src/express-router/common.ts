import { RuntimePackages } from '@oats-ts/openapi-common'
import { Block, factory, NodeFlags, Statement } from 'typescript'
import { RouterNames } from '../utils/RouterNames'

export function getToolkitStatement(): Statement {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(RouterNames.toolkit),
          undefined,
          factory.createTypeReferenceNode(
            factory.createIdentifier(RuntimePackages.HttpServerExpress.ExpressToolkit),
            undefined,
          ),
          factory.createObjectLiteralExpression(
            [
              factory.createShorthandPropertyAssignment(factory.createIdentifier(RouterNames.request), undefined),
              factory.createShorthandPropertyAssignment(factory.createIdentifier(RouterNames.response), undefined),
              factory.createShorthandPropertyAssignment(factory.createIdentifier(RouterNames.next), undefined),
            ],
            false,
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}

export function getAdapterStatement(): Statement {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(RouterNames.adapter),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Http.ServerAdapter), [
            factory.createTypeReferenceNode(
              factory.createIdentifier(RuntimePackages.HttpServerExpress.ExpressToolkit),
              undefined,
            ),
          ]),
          factory.createElementAccessExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(RouterNames.response),
              factory.createIdentifier(RouterNames.locals),
            ),
            factory.createStringLiteral(RouterNames.adapterKey),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}

export function getCatchBlock(): Block {
  return factory.createBlock(
    [
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(RouterNames.adapter),
            factory.createIdentifier(RouterNames.handleError),
          ),
          undefined,
          [factory.createIdentifier(RouterNames.toolkit), factory.createIdentifier(RouterNames.error)],
        ),
      ),
    ],
    true,
  )
}
