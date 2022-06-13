import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { ExpressRoutesGenerator } from './ExpressRoutesGenerator'
import { ExpressRoutesGeneratorConfig } from './typings'

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

export function expressRoutes(config: Partial<ExpressRoutesGeneratorConfig & GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressRoutesGenerator(defaultConfig(config))
}
