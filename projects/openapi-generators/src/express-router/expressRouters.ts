import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressRoutersGenerator } from './ExpressRoutersGenerator'
import { ExpressRoutersGeneratorConfig as ExpressRoutersGeneratorConfig } from './typings'

function defaultConfig({
  apiKey,
  adapterKey,
  ...rest
}: Partial<ExpressRoutersGeneratorConfig & GeneratorConfig>): ExpressRoutersGeneratorConfig & Partial<GeneratorConfig> {
  return {
    apiKey: apiKey ?? '__oats_api',
    adapterKey: adapterKey ?? '__oats_adapter',
    ...rest,
  }
}

export function expressRouters(
  config: Partial<ExpressRoutersGeneratorConfig & GeneratorConfig> = {},
): OpenAPIGenerator {
  return new ExpressRoutersGenerator(defaultConfig(config))
}
