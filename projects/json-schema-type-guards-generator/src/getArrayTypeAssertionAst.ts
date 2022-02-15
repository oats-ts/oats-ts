import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { CallExpression, Expression, factory, SyntaxKind, TrueLiteral } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { reduceLogicalExpressions } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { TypeGuardGeneratorConfig } from './typings'

function getArrayItemAsserterAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  level: number,
): Expression {
  if (typeof data.items === 'boolean') {
    return factory.createTrue()
  }
  const itemAssertion = getTypeAssertionAst(data.items, context, factory.createIdentifier('item'), config, level + 1)
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
  level: number,
): Expression {
  const { uriOf } = context
  const itemsSchema = data.items as Referenceable<SchemaObject>
  const uri = uriOf(itemsSchema)
  const expressions: Expression[] = [
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('Array'), factory.createIdentifier('isArray')),
      undefined,
      [variable],
    ),
    ...(config.ignore(itemsSchema, uri) ? [] : [getArrayItemAsserterAst(data, context, variable, config, level)]),
  ]
  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}
