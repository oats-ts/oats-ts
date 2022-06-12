import { OpenAPIGenerator } from '../types'
import { ExpressRoutesGenerator } from './ExpressRoutesGenerator'
import { ExpressRouteGeneratorConfig } from './typings'

function defaultConfig(config: Partial<ExpressRouteGeneratorConfig>): ExpressRouteGeneratorConfig {
  return {
    apiKey: config?.apiKey ?? '__oats_api',
    adapterKey: config?.adapterKey ?? '__oats_adapter',
  }
}

export function expressRoutes(config: Partial<ExpressRouteGeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressRoutesGenerator(defaultConfig(config))
}
