import { EnhancedOperation } from '@oats-ts/openapi-common'
import { CorsConfigurationGeneratorConfig } from './typings'

export function isOperationCorsEnabled(value: EnhancedOperation, config: CorsConfigurationGeneratorConfig) {
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
