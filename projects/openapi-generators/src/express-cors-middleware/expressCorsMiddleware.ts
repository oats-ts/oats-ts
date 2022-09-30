import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressCorsMiddlewareGenerator } from './ExpressCorsMiddlewareGenerator'
import { ExpressCorsMiddlewareGeneratorConfig } from './typings'

function defaultConfig({
  getAllowedOrigins,
  getMaxAge,
  isCredentialsAllowed,
  isMethodAllowed,
  isRequestHeaderAllowed,
  isResponseHeaderAllowed,
  ...rest
}: Partial<ExpressCorsMiddlewareGeneratorConfig & GeneratorConfig>): ExpressCorsMiddlewareGeneratorConfig &
  Partial<GeneratorConfig> {
  return {
    getAllowedOrigins: getAllowedOrigins ?? (() => false),
    getMaxAge: getMaxAge ?? (() => undefined),
    isMethodAllowed: isMethodAllowed ?? (() => true),
    isCredentialsAllowed: isCredentialsAllowed ?? (() => false),
    isRequestHeaderAllowed: isRequestHeaderAllowed ?? ((_, header) => header !== 'cookie'),
    isResponseHeaderAllowed: isResponseHeaderAllowed ?? ((_, header) => header !== 'set-cookie'),
    ...rest,
  }
}

export function expressCorsMiddleware(
  config: Partial<ExpressCorsMiddlewareGeneratorConfig & GeneratorConfig> = {},
): OpenAPIGenerator {
  return new ExpressCorsMiddlewareGenerator(defaultConfig(config))
}
