import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressContextHandlerFactoryGenerator } from './ExpressContextHandlerFactoryGenerator'

export function expressContextHandlerFactory(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressContextHandlerFactoryGenerator(config)
}
