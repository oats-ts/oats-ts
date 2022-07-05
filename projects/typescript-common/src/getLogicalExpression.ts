import { head } from 'lodash'
import { Expression, BinaryExpression, factory, LogicalOperator } from 'typescript'

export function getLogicalExpression(
  operator: LogicalOperator,
  expressions: Expression[],
): Expression | BinaryExpression {
  switch (expressions.length) {
    case 0:
      throw new TypeError(`Cannot create BinaryExpression from 0 elements`)
    case 1:
      return head(expressions)!
    default: {
      const [h, ...t] = expressions
      return factory.createBinaryExpression(h, operator, getLogicalExpression(operator, t))
    }
  }
}
