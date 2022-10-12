import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressContextRouterFactoryGenerator } from './ExpressContextRouterFactoryGenerator'

export function expressContextRouterFactory(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressContextRouterFactoryGenerator(config)
}
