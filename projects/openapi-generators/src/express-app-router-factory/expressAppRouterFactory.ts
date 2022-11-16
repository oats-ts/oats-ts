import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ExpressAppRouterFactoryGenerator } from './ExpressAppRouterFactoryGenerator'

export function expressAppRouterFactory(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new ExpressAppRouterFactoryGenerator(config)
}
