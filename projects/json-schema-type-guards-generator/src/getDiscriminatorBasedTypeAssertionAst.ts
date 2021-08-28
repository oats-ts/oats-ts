import { entries, sortBy } from 'lodash'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { getDiscriminators } from '@oats-ts/model-common'
import { reduceLogicalExpressions, safeMemberAccess } from '@oats-ts/typescript-common'
import { TypeGuardGeneratorContext } from './typings'

export function getDiscriminatorBasedTypeAssertionAst(
  data: SchemaObject,
  context: TypeGuardGeneratorContext,
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
        safeMemberAccess(variable, name),
        SyntaxKind.EqualsEqualsEqualsToken,
        factory.createStringLiteral(value),
      )
    }),
  ]
  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, assertions)
}
