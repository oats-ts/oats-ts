import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressContextRouterFactoryGenerator } from './ExpressContextHandlerFactoryGenerator'

export function expressContextRouterFactory(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressContextRouterFactoryGenerator(config)
}
