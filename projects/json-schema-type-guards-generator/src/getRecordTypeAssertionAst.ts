import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { CallExpression, Expression, factory, SyntaxKind, TrueLiteral } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { TypeGuardGeneratorConfig } from './typings'
import { reduceLogicalExpressions } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

function getRecordItemsAsserterAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  level: number,
): CallExpression | TrueLiteral {
  const itemAssertion = getTypeAssertionAst(
    data.additionalProperties as SchemaObject | ReferenceObject,
    context,
    factory.createElementAccessExpression(variable, factory.createIdentifier('key')),
    config,
    level + 1,
  )

  if (itemAssertion.kind === SyntaxKind.TrueKeyword) {
    return factory.createTrue()
  }

  const arrowFn = factory.createArrowFunction(
    undefined,
    undefined,
    [factory.createParameterDeclaration(undefined, undefined, undefined, factory.createIdentifier('key'))],
    undefined,
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    itemAssertion,
  )

  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('Object'), factory.createIdentifier('keys')),
        undefined,
        [variable],
      ),
      factory.createIdentifier('every'),
    ),
    undefined,
    [arrowFn],
  )
}

export function getRecordTypeAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  level: number,
): Expression {
  const { uriOf } = context
  const propsSchema = data.additionalProperties as Referenceable<SchemaObject>
  const propsUri = uriOf(propsSchema)
  const expressions: Expression[] = [
    factory.createBinaryExpression(variable, SyntaxKind.ExclamationEqualsEqualsToken, factory.createNull()),
    factory.createBinaryExpression(
      factory.createTypeOfExpression(variable),
      SyntaxKind.EqualsEqualsEqualsToken,
      factory.createStringLiteral('object'),
    ),
    ...(config.ignore(propsSchema, propsUri)
      ? [getRecordItemsAsserterAst(data, context, variable, config, level)]
      : []),
  ]
  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}
