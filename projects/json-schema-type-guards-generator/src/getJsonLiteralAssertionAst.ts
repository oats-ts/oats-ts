import { reduceLogicalExpressions, safeMemberAccess } from '@oats-ts/typescript-common'
import { entries } from 'lodash'
import { BinaryExpression, Expression, factory, SyntaxKind } from 'typescript'

function equalsPrimitive(variable: Expression, data: Expression): BinaryExpression {
  return factory.createBinaryExpression(variable, SyntaxKind.EqualsEqualsEqualsToken, data)
}

function equalsObject(data: Record<string, any>, variable: Expression): Expression {
  const expressions: Expression[] = [
    factory.createBinaryExpression(
      factory.createTypeOfExpression(variable),
      SyntaxKind.EqualsEqualsEqualsToken,
      factory.createStringLiteral('object'),
    ),
    factory.createBinaryExpression(
      factory.createTypeOfExpression(variable),
      SyntaxKind.ExclamationEqualsEqualsToken,
      factory.createNull(),
    ),
    ...entries(data).map(([key, value]) => getJsonLiteralAssertionAst(value, safeMemberAccess(variable, key))),
  ]
  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}

function equalsArray(data: any[], variable: Expression): Expression {
  const expressions: Expression[] = [
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('Array'), factory.createIdentifier('isArray')),
      undefined,
      [variable],
    ),
    ...data.map((item, index) =>
      getJsonLiteralAssertionAst(
        item,
        factory.createElementAccessExpression(variable, factory.createNumericLiteral(index)),
      ),
    ),
  ]
  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}

export function getJsonLiteralAssertionAst(data: any, variable: Expression): Expression {
  if (data === null) {
    return equalsPrimitive(variable, factory.createNull())
  } else if (typeof data === 'string') {
    return equalsPrimitive(variable, factory.createStringLiteral(data))
  } else if (typeof data === 'number') {
    return equalsPrimitive(variable, factory.createNumericLiteral(data))
  } else if (typeof data === 'boolean') {
    return equalsPrimitive(variable, data ? factory.createTrue() : factory.createFalse())
  } else if (Array.isArray(data)) {
    return equalsArray(data, variable)
  } else if (typeof data === 'object') {
    return equalsObject(data, variable)
  }
  return factory.createTrue()
}
