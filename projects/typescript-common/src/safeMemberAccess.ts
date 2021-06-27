import { Expression, factory, PropertyAccessExpression, ElementAccessExpression } from 'typescript'
import { isIdentifier } from './isIdentifier'

export function safeMemberAccess(
  expression: Expression,
  member: string,
): PropertyAccessExpression | ElementAccessExpression {
  return isIdentifier(member)
    ? factory.createPropertyAccessExpression(expression, member)
    : factory.createElementAccessExpression(expression, factory.createStringLiteral(member))
}
