import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { CallExpression, Expression, factory, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { reduceExpressions } from './reduceExpressions'
import { FullTypeGuardGeneratorConfig } from './typings'

function getRecordItemsAsserterAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): CallExpression {
  const arrowFn = factory.createArrowFunction(
    undefined,
    undefined,
    [factory.createParameterDeclaration(undefined, undefined, undefined, factory.createIdentifier('key'))],
    undefined,
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    getTypeAssertionAst(
      data.additionalProperties as SchemaObject | ReferenceObject,
      context,
      factory.createElementAccessExpression(variable, factory.createIdentifier('key')),
      config,
    ),
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
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  const expressions: Expression[] = [
    factory.createBinaryExpression(variable, SyntaxKind.ExclamationEqualsEqualsToken, factory.createNull()),
    factory.createBinaryExpression(
      factory.createTypeOfExpression(variable),
      SyntaxKind.EqualsEqualsEqualsToken,
      factory.createStringLiteral('object'),
    ),
    ...(config.records ? [getRecordItemsAsserterAst(data, context, variable, config)] : []),
  ]
  return reduceExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}
