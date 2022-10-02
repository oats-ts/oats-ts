import { RuntimePackages } from '@oats-ts/openapi-common'
import { factory, NodeFlags, Statement } from 'typescript'
import { RouterNames } from './RouterNames'

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
