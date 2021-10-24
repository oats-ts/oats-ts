import { entries, isNil } from 'lodash'
import { factory, PropertyAssignment } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getResponseBodyValidatorPropertyAst } from './getResponseBodyValidatorPropertyAst'

export function getResponseBodyValidatorPropertiesAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): PropertyAssignment[] {
  const { operation } = data
  const { default: defaultResponse, ...responses } = operation.responses || {}
  const { dereference } = context
  const properties: PropertyAssignment[] = []
  properties.push(
    ...entries(responses).map(
      ([statusCode, response]): PropertyAssignment =>
        factory.createPropertyAssignment(
          factory.createNumericLiteral(Number(statusCode)),
          factory.createObjectLiteralExpression(getResponseBodyValidatorPropertyAst(dereference(response), context)),
        ),
    ),
  )
  if (!isNil(defaultResponse)) {
    properties.push(
      factory.createPropertyAssignment(
        'default',
        factory.createObjectLiteralExpression(getResponseBodyValidatorPropertyAst(dereference(defaultResponse), context)),
      ),
    )
  }
  return properties
}
