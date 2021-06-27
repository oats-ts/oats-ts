import { entries, has, sortBy } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { Expression, factory, SyntaxKind } from 'typescript'
import { getDiscriminators } from '@oats-ts/openapi-common'
import { tsBinaryExpressions, tsMemberAccess } from '../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { reduceExpressions } from './reduceExpressions'
import { FullTypeGuardGeneratorConfig } from './typings'

export function getObjectTypeAssertionAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  const discriminators = getDiscriminators(data, context) || {}
  const discriminatorAssertions = sortBy(entries(discriminators), ([name]) => name).map(([name, value]) => {
    return factory.createBinaryExpression(
      tsMemberAccess(variable, name),
      SyntaxKind.EqualsEqualsEqualsToken,
      factory.createStringLiteral(value),
    )
  })
  const propertyAssertions = sortBy(entries(data.properties || {}), ([name]) => name)
    .filter(([name]) => !has(discriminators, name))
    .map(([name, schemaOrRef]) => {
      const memberVar = tsMemberAccess(variable, name)
      const assertion = getTypeAssertionAst(schemaOrRef, context, memberVar, config)
      if (assertion.kind === SyntaxKind.TrueKeyword) {
        return assertion
      }
      const isOptional = (data.required || []).indexOf(name) < 0
      return isOptional
        ? tsBinaryExpressions(SyntaxKind.BarBarToken, [
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

  return reduceExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}
