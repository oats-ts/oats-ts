import { getLogicalExpression } from '@oats-ts/typescript-common'
import { BinaryExpression, Expression, factory, SyntaxKind } from 'typescript'
import { RouterNames } from '../RouterNames'

export function getOriginAst(): Expression {
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier(RouterNames.request),
      factory.createIdentifier(RouterNames.header),
    ),
    undefined,
    [factory.createStringLiteral(RouterNames.origin)],
  )
}

export function getOriginEqualsExpression(value: string): BinaryExpression {
  return factory.createBinaryExpression(
    getOriginAst(),
    SyntaxKind.EqualsEqualsEqualsToken,
    factory.createStringLiteral(value),
  )
}

export function getOriginCheckExpression(values: string[]): Expression {
  return getLogicalExpression(SyntaxKind.BarBarToken, values.map(getOriginEqualsExpression))
}

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

export function getNextCall() {
  return factory.createExpressionStatement(
    factory.createCallExpression(factory.createIdentifier(RouterNames.next), [], []),
  )
}
