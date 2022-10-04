import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { CallExpression, Expression, factory, SyntaxKind, TrueLiteral } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { TypeGuardGeneratorConfig } from './typings'
import { reduceLogicalExpressions } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '../types'

function getRecordItemsAsserterAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  level: number,
): CallExpression | TrueLiteral {
  const keyVar = factory.createIdentifier('key')
  const itemAssertion = getTypeAssertionAst(
    data.additionalProperties as SchemaObject | ReferenceObject,
    context,
    factory.createElementAccessExpression(variable, keyVar),
    config,
    level + 1,
  )

  if (itemAssertion.kind === SyntaxKind.TrueKeyword) {
    return factory.createTrue()
  }

  const arrowFn = factory.createArrowFunction(
    undefined,
    undefined,
    [factory.createParameterDeclaration(undefined, undefined, undefined, keyVar)],
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
  const propsSchema = data.additionalProperties as Referenceable<SchemaObject>
  const propsUri = context.uriOf(propsSchema)
  const expressions: Expression[] = [
    factory.createBinaryExpression(variable, SyntaxKind.ExclamationEqualsEqualsToken, factory.createNull()),
    factory.createBinaryExpression(
      factory.createTypeOfExpression(variable),
      SyntaxKind.EqualsEqualsEqualsToken,
      factory.createStringLiteral('object'),
    ),
    ...(config.ignore(propsSchema, propsUri)
      ? []
      : [getRecordItemsAsserterAst(data, context, variable, config, level)]),
  ]
  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}
