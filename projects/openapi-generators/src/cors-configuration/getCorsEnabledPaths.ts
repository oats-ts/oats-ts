import { EnhancedPathItem } from '@oats-ts/openapi-common'
import { isOperationCorsEnabled } from './isOperationCorsEnabled'
import { CorsConfigurationGeneratorConfig } from './typings'

export function getCorsEnabledPaths(paths: EnhancedPathItem[], config: CorsConfigurationGeneratorConfig) {
  return paths.filter(({ operations }) => operations.some((operation) => isOperationCorsEnabled(operation, config)))
}
