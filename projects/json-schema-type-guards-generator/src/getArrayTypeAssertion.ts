import { SchemaObject } from '@oats-ts/json-schema-model'
import { CallExpression, Expression, factory, SyntaxKind, TrueLiteral } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { FullTypeGuardGeneratorConfig, TypeGuardGeneratorContext } from './typings'
import { reduceLogicalExpressions } from '@oats-ts/typescript-common'

function getArrayItemAsserterAst(
  data: SchemaObject,
  context: TypeGuardGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
  level: number,
): CallExpression | TrueLiteral {
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
  context: TypeGuardGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
  level: number,
): Expression {
  const expressions: Expression[] = [
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('Array'), factory.createIdentifier('isArray')),
      undefined,
      [variable],
    ),
    ...(config.arrays ? [getArrayItemAsserterAst(data, context, variable, config, level)] : []),
  ]
  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}