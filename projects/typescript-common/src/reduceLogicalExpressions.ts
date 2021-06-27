import { head } from 'lodash'
import { BinaryOperator, Expression, factory, SyntaxKind } from 'typescript'
import { getLogicalExpression } from './getLogicalExpression'

export function reduceLogicalExpressions(operator: BinaryOperator, expressions: Expression[]): Expression {
  const filtered = expressions.filter((expr) => expr.kind !== SyntaxKind.TrueKeyword)
  switch (filtered.length) {
    case 0:
      return factory.createTrue()
    case 1:
      return head(filtered)
    default:
      return getLogicalExpression(operator, filtered)
  }
}
