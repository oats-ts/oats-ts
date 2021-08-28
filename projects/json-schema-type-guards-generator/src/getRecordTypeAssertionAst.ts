import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { CallExpression, Expression, factory, SyntaxKind, TrueLiteral } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { FullTypeGuardGeneratorConfig, TypeGuardGeneratorContext } from './typings'
import { reduceLogicalExpressions } from '@oats-ts/typescript-common'

function getRecordItemsAsserterAst(
  data: SchemaObject,
  context: TypeGuardGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
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
  context: TypeGuardGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
  level: number,
): Expression {
  const expressions: Expression[] = [
    factory.createBinaryExpression(variable, SyntaxKind.ExclamationEqualsEqualsToken, factory.createNull()),
    factory.createBinaryExpression(
      factory.createTypeOfExpression(variable),
      SyntaxKind.EqualsEqualsEqualsToken,
      factory.createStringLiteral('object'),
    ),
    ...(config.records ? [getRecordItemsAsserterAst(data, context, variable, config, level)] : []),
  ]
  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}
