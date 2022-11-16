import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ExpressContextRouterFactoryGenerator } from './ExpressContextRouterFactoryGenerator'

export function expressContextRouterFactory(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new ExpressContextRouterFactoryGenerator(config)
}
