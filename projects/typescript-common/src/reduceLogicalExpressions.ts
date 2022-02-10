import { head } from 'lodash'
import { Expression, factory, LogicalOperator, SyntaxKind } from 'typescript'
import { getLogicalExpression } from './getLogicalExpression'

export function reduceLogicalExpressions(operator: LogicalOperator, expressions: Expression[]): Expression {
  const filtered = expressions.filter((expr) => expr.kind !== SyntaxKind.TrueKeyword)
  const hasTrue = filtered.length !== expressions.length
  if (hasTrue && operator === SyntaxKind.BarBarToken) {
    return factory.createTrue()
  }
  switch (filtered.length) {
    case 0:
      return factory.createTrue()
    case 1:
      return head(filtered)
    default:
      return getLogicalExpression(operator, filtered)
  }
}
