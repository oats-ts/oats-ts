import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressRouterFactoryGenerator } from './ExpressRouterFactoryGenerator'
import { ExpressRouterFactoryGeneratorConfig } from './typings'

function defaultConfig({
  apiKey,
  adapterKey,
  ...rest
}: Partial<ExpressRouterFactoryGeneratorConfig & GeneratorConfig>): ExpressRouterFactoryGeneratorConfig &
  Partial<GeneratorConfig> {
  return {
    apiKey: apiKey ?? '__oats_api',
    adapterKey: adapterKey ?? '__oats_adapter',
    ...rest,
  }
}

export function expressRouterFactory(config: Partial<ExpressRouterFactoryGeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressRouterFactoryGenerator(defaultConfig(config))
}
