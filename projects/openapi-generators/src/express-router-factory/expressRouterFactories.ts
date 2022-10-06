import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressRouterFactoriesGenerator } from './ExpressRouterFactoriesGenerator'
import { ExpressRouterFactoriesGeneratorConfig as ExpressRouterFactoriesGeneratorConfig } from './typings'

function defaultConfig({
  getAllowedOrigins,
  isCredentialsAllowed,
  isResponseHeaderAllowed,
  isMethodAllowed,
  ...rest
}: Partial<ExpressRouterFactoriesGeneratorConfig & GeneratorConfig>): ExpressRouterFactoriesGeneratorConfig &
  Partial<GeneratorConfig> {
  return {
    getAllowedOrigins: getAllowedOrigins ?? (() => false),
    isCredentialsAllowed: isCredentialsAllowed ?? (() => false),
    isMethodAllowed: isMethodAllowed ?? (() => true),
    isResponseHeaderAllowed: isResponseHeaderAllowed ?? (() => true),
    ...rest,
  }
}

export function expressRouterFactories(
  config: Partial<ExpressRouterFactoriesGeneratorConfig & GeneratorConfig> = {},
): OpenAPIGenerator {
  return new ExpressRouterFactoriesGenerator(defaultConfig(config))
}
