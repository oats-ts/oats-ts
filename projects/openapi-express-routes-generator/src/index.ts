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
    apiKey: config?.apiKey ?? '__oats_api',
    adapterKey: config?.adapterKey ?? '__oats_adapter',
  }
}

export function expressRoute(config: Partial<ExpressRouteGeneratorConfig> = {}): ExpressRoutesGenerator {
  return new ExpressRoutesGenerator(defaultConfig(config))
}

export function expressRoutesType(): ExpressRoutesTypeGenerator {
  return new ExpressRoutesTypeGenerator()
}

export function expressRouteFactory(config: Partial<ExpressRouteGeneratorConfig> = {}): ExpressRouteFactoryGenerator {
  return new ExpressRouteFactoryGenerator(defaultConfig(config))
}

export function expressCorsMiddleware(): ExpressCorsMiddlewareGenerator {
  return new ExpressCorsMiddlewareGenerator()
}
