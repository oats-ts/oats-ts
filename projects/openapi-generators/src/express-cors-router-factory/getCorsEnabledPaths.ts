import { EnhancedPathItem } from '@oats-ts/openapi-common'
import { isOperationCorsEnabled } from '../express-router-factory/isOperationCorsEnabled'
import { ExpressCorsRouterFactoryGeneratorConfig } from './typings'

export function getCorsEnabledPaths(paths: EnhancedPathItem[], config: ExpressCorsRouterFactoryGeneratorConfig) {
  return paths.filter(({ operations }) => operations.some((operation) => isOperationCorsEnabled(operation, config)))
}
