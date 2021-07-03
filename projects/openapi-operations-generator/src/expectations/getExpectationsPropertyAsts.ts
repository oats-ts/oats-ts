import { entries, isNil } from 'lodash'
import { factory, PropertyAssignment } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getExpectationPropertyAsts } from './getExpectationPropertyAsts'
import { OperationsGeneratorConfig } from '../typings'

export function getExpectationsPropertyAsts(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): PropertyAssignment[] {
  const { operation } = data
  const { default: defaultResponse, ...responses } = operation.responses || {}
  const { accessor } = context
  const properties: PropertyAssignment[] = []
  properties.push(
    ...entries(responses).map(
      ([statusCode, response]): PropertyAssignment =>
        factory.createPropertyAssignment(
          factory.createNumericLiteral(Number(statusCode)),
          factory.createObjectLiteralExpression(
            getExpectationPropertyAsts(accessor.dereference(response), context, config),
          ),
        ),
    ),
  )
  if (!isNil(defaultResponse)) {
    properties.push(
      factory.createPropertyAssignment(
        'default',
        factory.createObjectLiteralExpression(
          getExpectationPropertyAsts(accessor.dereference(defaultResponse), context, config),
        ),
      ),
    )
  }
  return properties
}
