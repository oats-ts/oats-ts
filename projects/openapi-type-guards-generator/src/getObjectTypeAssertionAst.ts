import { entries, has, sortBy } from 'lodash'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { getDiscriminators } from '@oats-ts/model-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { FullTypeGuardGeneratorConfig } from './typings'
import { getLogicalExpression, reduceLogicalExpressions, safeMemberAccess } from '@oats-ts/typescript-common'

export function getObjectTypeAssertionAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
  level: number,
): Expression {
  const discriminators = getDiscriminators(data, context) || {}
  const discriminatorAssertions = sortBy(entries(discriminators), ([name]) => name).map(([name, value]) => {
    return factory.createBinaryExpression(
      safeMemberAccess(variable, name),
      SyntaxKind.EqualsEqualsEqualsToken,
      factory.createStringLiteral(value),
    )
  })
  const propertyAssertions = sortBy(entries(data.properties || {}), ([name]) => name)
    .filter(([name]) => !has(discriminators, name))
    .map(([name, schemaOrRef]) => {
      const memberVar = safeMemberAccess(variable, name)
      const assertion = getTypeAssertionAst(schemaOrRef, context, memberVar, config, level + 1)
      if (assertion.kind === SyntaxKind.TrueKeyword) {
        return assertion
      }
      const isOptional = (data.required || []).indexOf(name) < 0
      return isOptional
        ? getLogicalExpression(SyntaxKind.BarBarToken, [
            factory.createBinaryExpression(memberVar, SyntaxKind.EqualsEqualsEqualsToken, factory.createNull()),
            factory.createBinaryExpression(
              memberVar,
              SyntaxKind.EqualsEqualsEqualsToken,
              factory.createIdentifier('undefined'),
            ),
            assertion,
          ])
        : assertion
    })

  const expressions: Expression[] = [
    factory.createBinaryExpression(variable, SyntaxKind.ExclamationEqualsEqualsToken, factory.createNull()),
    factory.createBinaryExpression(
      factory.createTypeOfExpression(variable),
      SyntaxKind.EqualsEqualsEqualsToken,
      factory.createStringLiteral('object'),
    ),
    ...discriminatorAssertions,
    ...propertyAssertions,
  ]

  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}
