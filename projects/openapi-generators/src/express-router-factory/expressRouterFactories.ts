import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ExpressRouterFactoriesGenerator } from './ExpressRouterFactoriesGenerator'
import { ExpressRouterFactoriesGeneratorConfig as ExpressRouterFactoriesGeneratorConfig } from './typings'

function defaultConfig({
  cors,
  ...rest
}: Partial<ExpressRouterFactoriesGeneratorConfig & GeneratorConfig>): ExpressRouterFactoriesGeneratorConfig &
  Partial<GeneratorConfig> {
  return {
    cors: cors ?? false,
    ...rest,
  }
}

export function expressRouterFactories(
  config: Partial<ExpressRouterFactoriesGeneratorConfig & GeneratorConfig> = {},
): OpenAPICodeGenerator {
  return new ExpressRouterFactoriesGenerator(defaultConfig(config))
}
