import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { reduceLogicalExpressions } from '@oats-ts/typescript-common'
import { TypeGuardGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext, TraversalHelper } from '../types'

function getArrayItemAsserterAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  helper: TraversalHelper,
  level: number,
): Expression {
  if (typeof data.items === 'boolean') {
    return factory.createTrue()
  }
  const itemAssertion = getTypeAssertionAst(
    data.items,
    context,
    factory.createIdentifier('item'),
    config,
    helper,
    level + 1,
  )
  if (itemAssertion.kind === SyntaxKind.TrueKeyword) {
    return factory.createTrue()
  }
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(variable, factory.createIdentifier('every')),
    undefined,
    [
      factory.createArrowFunction(
        undefined,
        undefined,
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('item'),
            undefined,
            factory.createTypeReferenceNode('any'),
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        itemAssertion,
      ),
    ],
  )
}

export function getArrayTypeAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  helper: TraversalHelper,
  level: number,
): Expression {
  const itemsSchema = data.items as Referenceable<SchemaObject>
  const expressions: Expression[] = [
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('Array'), factory.createIdentifier('isArray')),
      undefined,
      [variable],
    ),
    ...(config.ignore(itemsSchema, helper)
      ? []
      : [getArrayItemAsserterAst(data, context, variable, config, helper, level)]),
  ]
  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}
