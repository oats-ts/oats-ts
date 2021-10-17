import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ExpressRoutesGenerator } from './ExpressRoutesGenerator'
import { ExpressRouteGeneratorConfig } from './typings'

export type { ExpressRouteGeneratorConfig } from './typings'
export { ExpressRoutesGenerator } from './ExpressRoutesGenerator'

export function expressRoute(config: GeneratorConfig & Partial<ExpressRouteGeneratorConfig>): OpenAPIGenerator {
  return new ExpressRoutesGenerator({
    ...config,
    apiImplKey: config.apiImplKey ?? '__oats_api',
    configurationKey: config.configurationKey ?? '__oats_configuration',
  })
}
