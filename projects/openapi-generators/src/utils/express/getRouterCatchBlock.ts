import { Block, factory } from 'typescript'
import { RouterNames } from './RouterNames'

export function getRouterCatchBlock(): Block {
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
