import { EnhancedPathItem, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { flatMap, isNil } from 'lodash'
import { Expression, factory } from 'typescript'
import { getCorsExpressionForPath } from './getCorsExpressionForPath'
import { CorsConfigurationGeneratorConfig } from './typings'

export function getCorsExpression(
  data: EnhancedPathItem[],
  context: OpenAPIGeneratorContext,
  config: CorsConfigurationGeneratorConfig,
): Expression | undefined {
  const properties = flatMap(data, (path) => {
    const corsExpression = getCorsExpressionForPath(path, context, config)
    if (isNil(corsExpression)) {
      return []
    }
    return factory.createPropertyAssignment(factory.createStringLiteral(path.url), corsExpression)
  })

  return factory.createObjectLiteralExpression(properties, true)
}
