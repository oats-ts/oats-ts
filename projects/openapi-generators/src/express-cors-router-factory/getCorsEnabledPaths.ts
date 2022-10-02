import { EnhancedPathItem } from '@oats-ts/openapi-common'
import { ExpressCorsRouterFactoryGeneratorConfig } from './typings'

export function getCorsEnabledPaths(paths: EnhancedPathItem[], config: ExpressCorsRouterFactoryGeneratorConfig) {
  return paths.filter(({ operations }) => {
    return operations.some(({ url, operation, method }) => {
      const isMethodAllowed = config.isMethodAllowed(url, method, operation)
      const allowedOrigins = config.getAllowedOrigins(url, method, operation)
      if (!isMethodAllowed) {
        return false
      }
      if (typeof allowedOrigins === 'boolean') {
        return allowedOrigins
      }
      return allowedOrigins.length > 0
    })
  })
}
