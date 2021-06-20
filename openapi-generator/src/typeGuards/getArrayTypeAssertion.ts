import { SchemaObject } from 'openapi3-ts'
import { CallExpression, Expression, factory, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '../typings'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { reduceExpressions } from './reduceExpressions'
import { FullTypeGuardGeneratorConfig } from './typings'

function getArrayItemAsserterAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): CallExpression {
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
        getTypeAssertionAst(data.items, context, factory.createIdentifier('item'), config),
      ),
    ],
  )
}

export function getArrayTypeAssertionAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  const expressions: Expression[] = [
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('Array'), factory.createIdentifier('isArray')),
      undefined,
      [variable],
    ),
    ...(config.records ? [getArrayItemAsserterAst(data, context, variable, config)] : []),
  ]
  return reduceExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}
