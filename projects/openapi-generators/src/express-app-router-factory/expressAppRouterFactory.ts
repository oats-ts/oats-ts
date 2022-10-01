import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressAppRouterFactoryGenerator } from './ExpressAppRouterFactoryGenerator'

export function expressAppRouterFactory(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressAppRouterFactoryGenerator(config)
}
