import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ExpressCorsMiddlewareGenerator } from './corsMiddleware/ExpressCorsMiddlewareGenerator'
import { ExpressRoutesGenerator } from './ExpressRoutesGenerator'
import { ExpressRouteFactoryGenerator } from './routeFactory/ExpressRouteFactoryGenerator'
import { ExpressRoutesTypeGenerator } from './routesType/ExpressRoutesTypeGenerator'
import { ExpressRouteGeneratorConfig } from './typings'

export type { ExpressRouteGeneratorConfig } from './typings'
export { ExpressRoutesGenerator } from './ExpressRoutesGenerator'
export { ExpressRoutesTypeGenerator } from './routesType/ExpressRoutesTypeGenerator'
export { ExpressRouteFactoryGenerator } from './routeFactory/ExpressRouteFactoryGenerator'
export { ExpressCorsMiddlewareGenerator } from './corsMiddleware/ExpressCorsMiddlewareGenerator'

function defaultConfig(config: Partial<ExpressRouteGeneratorConfig>): ExpressRouteGeneratorConfig {
  return {
    apiImplKey: config?.apiImplKey ?? '__oats_api',
    configurationKey: config?.configurationKey ?? '__oats_configuration',
  }
}

export function expressRoute(config: Partial<ExpressRouteGeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressRoutesGenerator(defaultConfig(config))
}

export function expressRoutesType(): OpenAPIGenerator {
  return new ExpressRoutesTypeGenerator()
}

export function expressRouteFactory(config: Partial<ExpressRouteGeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressRouteFactoryGenerator(defaultConfig(config))
}

export function expressCorsMiddleware(): OpenAPIGenerator {
  return new ExpressCorsMiddlewareGenerator()
}
