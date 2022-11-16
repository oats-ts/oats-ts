import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ExpressCorsRouterFactoryGenerator } from './ExpressCorsRouterFactoryGenerator'

export function expressCorsRouterFactory(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new ExpressCorsRouterFactoryGenerator(config)
}
