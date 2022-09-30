import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressRouterFactoryGenerator } from './ExpressRouterFactoryGenerator'

export function expressRouterFactory(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressRouterFactoryGenerator(config)
}
