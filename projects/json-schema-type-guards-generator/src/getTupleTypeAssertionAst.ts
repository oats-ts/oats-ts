import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { FullTypeGuardGeneratorConfig } from './typings'
import { reduceLogicalExpressions } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function getTupleTypeAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
  level: number,
): Expression {
  const { prefixItems = [], minItems = 0 } = data
  const isArrayExpression = factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('Array'), factory.createIdentifier('isArray')),
    undefined,
    [variable],
  )
  const expressions = prefixItems.map((item, index) => {
    const itemAst = factory.createElementAccessExpression(variable, factory.createNumericLiteral(index))
    const itemAssert = getTypeAssertionAst(item, context, itemAst, config, level)
    if (index < minItems) {
      return itemAssert
    }
    return reduceLogicalExpressions(SyntaxKind.BarBarToken, [
      factory.createBinaryExpression(itemAst, SyntaxKind.EqualsEqualsEqualsToken, factory.createNull()),
      factory.createBinaryExpression(
        itemAst,
        SyntaxKind.EqualsEqualsEqualsToken,
        factory.createIdentifier('undefined'),
      ),
      itemAssert,
    ])
  })
  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, [isArrayExpression, ...expressions])
}
