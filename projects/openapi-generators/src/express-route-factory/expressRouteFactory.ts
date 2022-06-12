import { OpenAPIGenerator } from '../types'
import { ExpressRouteFactoryGenerator } from './ExpressRouteFactoryGenerator'
import { ExpressRouterFactoryGeneratorConfig } from './typings'

function defaultConfig(config: Partial<ExpressRouterFactoryGeneratorConfig>): ExpressRouterFactoryGeneratorConfig {
  return {
    apiKey: config?.apiKey ?? '__oats_api',
    adapterKey: config?.adapterKey ?? '__oats_adapter',
  }
}

export function expressRouteFactory(config: Partial<ExpressRouterFactoryGeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressRouteFactoryGenerator(defaultConfig(config))
}
