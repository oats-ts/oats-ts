import { entries, sortBy } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { Expression, factory, SyntaxKind } from 'typescript'
import { getDiscriminators } from '@oats-ts/openapi-common'
import { tsMemberAccess } from '../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { reduceExpressions } from './reduceExpressions'

export function getDiscriminatorBasedTypeAssertionAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
): Expression {
  const discriminators = getDiscriminators(data, context)
  const variable = factory.createIdentifier('input')
  const assertions: Expression[] = [
    factory.createBinaryExpression(variable, SyntaxKind.ExclamationEqualsEqualsToken, factory.createNull()),
    factory.createBinaryExpression(
      factory.createTypeOfExpression(variable),
      SyntaxKind.EqualsEqualsEqualsToken,
      factory.createStringLiteral('object'),
    ),
    ...sortBy(entries(discriminators), ([name]) => name).map(([name, value]) => {
      return factory.createBinaryExpression(
        tsMemberAccess(variable, name),
        SyntaxKind.EqualsEqualsEqualsToken,
        factory.createStringLiteral(value),
      )
    }),
  ]
  return reduceExpressions(SyntaxKind.AmpersandAmpersandToken, assertions)
}
