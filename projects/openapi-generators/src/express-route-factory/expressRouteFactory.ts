import { GeneratorConfig } from '@oats-ts/generator'
import { ExpressRoutesGeneratorConfig } from '../express-route/typings'
import { OpenAPIGenerator } from '../types'
import { ExpressRouteFactoryGenerator } from './ExpressRouteFactoryGenerator'
import { ExpressRouterFactoryGeneratorConfig } from './typings'

function defaultConfig({
  apiKey,
  adapterKey,
  ...rest
}: Partial<ExpressRoutesGeneratorConfig & GeneratorConfig>): ExpressRoutesGeneratorConfig & Partial<GeneratorConfig> {
  return {
    apiKey: apiKey ?? '__oats_api',
    adapterKey: adapterKey ?? '__oats_adapter',
    ...rest,
  }
}

export function expressRouteFactory(config: Partial<ExpressRouterFactoryGeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressRouteFactoryGenerator(defaultConfig(config))
}
