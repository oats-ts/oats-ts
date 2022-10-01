import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressCorsRouterFactoryGenerator } from './ExpressCorsRouterFactoryGenerator'
import { ExpressCorsRouterFactoryGeneratorConfig } from './typings'

function defaultConfig({
  getAllowedOrigins,
  getMaxAge,
  isCredentialsAllowed,
  isMethodAllowed,
  isRequestHeaderAllowed,
  isResponseHeaderAllowed,
  ...rest
}: Partial<ExpressCorsRouterFactoryGeneratorConfig & GeneratorConfig>): ExpressCorsRouterFactoryGeneratorConfig &
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

export function expressCorsRouterFactory(
  config: Partial<ExpressCorsRouterFactoryGeneratorConfig & GeneratorConfig> = {},
): OpenAPIGenerator {
  return new ExpressCorsRouterFactoryGenerator(defaultConfig(config))
}
