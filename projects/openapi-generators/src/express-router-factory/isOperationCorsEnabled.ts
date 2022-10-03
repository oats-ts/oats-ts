import { EnhancedOperation } from '@oats-ts/openapi-common'
import { ExpressRouterFactoriesGeneratorConfig } from './typings'

export function isOperationCorsEnabled(value: EnhancedOperation, config: ExpressRouterFactoriesGeneratorConfig) {
  const { url, method, operation } = value
  const allowedOrigins = config.getAllowedOrigins(url, method, operation)
  const isMethodAllowed = config.isMethodAllowed(url, method, operation)
  if (!isMethodAllowed) {
    return false
  }
  if (typeof allowedOrigins === 'boolean') {
    return allowedOrigins
  }
  return allowedOrigins.length > 0
}
