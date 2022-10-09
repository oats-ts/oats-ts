import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressCorsRouterFactoryGenerator } from './ExpressCorsRouterFactoryGenerator'

export function expressCorsRouterFactory(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressCorsRouterFactoryGenerator(config)
}
