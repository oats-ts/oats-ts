import { EnhancedPathItem, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { flatMap, isNil } from 'lodash'
import { Expression, factory } from 'typescript'
import { getCorsExpressionForOperation } from './getCorsExpressionForOperation'
import { CorsConfigurationGeneratorConfig } from './typings'

export function getCorsExpressionForPath(
  data: EnhancedPathItem,
  context: OpenAPIGeneratorContext,
  config: CorsConfigurationGeneratorConfig,
): Expression | undefined {
  const { operations } = data

  const properties = flatMap(operations, (operation) => {
    const corsExpression = getCorsExpressionForOperation(operation, context, config)
    if (isNil(corsExpression)) {
      return []
    }
    return factory.createPropertyAssignment(operation.method, corsExpression)
  })

  if (properties.length === 0) {
    return undefined
  }
  return factory.createObjectLiteralExpression(properties, true)
}
