import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ExpressRoutesGenerator } from './ExpressRoutesGenerator'
import { ExpressRouteFactoryGenerator } from './routeFactory/ExpressRouteFactoryGenerator'
import { ExpressRoutesTypeGenerator } from './routesType/ExpressRoutesTypeGenerator'
import { ExpressRouteGeneratorConfig } from './typings'

export type { ExpressRouteGeneratorConfig } from './typings'
export { ExpressRoutesGenerator } from './ExpressRoutesGenerator'
export { ExpressRoutesTypeGenerator } from './routesType/ExpressRoutesTypeGenerator'
export { ExpressRouteFactoryGenerator } from './routeFactory/ExpressRouteFactoryGenerator'

function defaultConfig(
  config: GeneratorConfig & Partial<ExpressRouteGeneratorConfig>,
): GeneratorConfig & ExpressRouteGeneratorConfig {
  return {
    ...config,
    apiImplKey: config.apiImplKey ?? '__oats_api',
    configurationKey: config.configurationKey ?? '__oats_configuration',
  }
}

export function expressRoute(config: GeneratorConfig & Partial<ExpressRouteGeneratorConfig>): OpenAPIGenerator {
  return new ExpressRoutesGenerator(defaultConfig(config))
}

export function expressRoutesType(config: GeneratorConfig): OpenAPIGenerator {
  return new ExpressRoutesTypeGenerator(config)
}

export function expressRouteFactory(config: GeneratorConfig & Partial<ExpressRouteGeneratorConfig>): OpenAPIGenerator {
  return new ExpressRouteFactoryGenerator(defaultConfig(config))
}
