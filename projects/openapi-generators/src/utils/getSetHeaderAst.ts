import { Expression, factory } from 'typescript'
import { RouterNames } from './RouterNames'

export function getSetHeaderAst(headerName: string, value: Expression) {
  return factory.createExpressionStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createIdentifier(RouterNames.response),
        factory.createIdentifier(RouterNames.setHeader),
      ),
      undefined,
      [factory.createStringLiteral(headerName), value],
    ),
  )
}
