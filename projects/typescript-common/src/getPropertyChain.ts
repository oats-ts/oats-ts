import { Expression, factory } from 'typescript'
import { isIdentifier } from './isIdentifier'

export function getPropertyChain(root: Expression, props: string[]): Expression {
  return props.reduce((expr: Expression, prop: string): Expression => {
    if (isIdentifier(prop)) {
      return factory.createPropertyAccessExpression(expr, prop)
    }
    return factory.createElementAccessExpression(expr, factory.createStringLiteral(prop))
  }, root)
}
