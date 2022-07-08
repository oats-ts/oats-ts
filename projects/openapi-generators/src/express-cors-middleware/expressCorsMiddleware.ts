import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { ExpressCorsMiddlewareGenerator } from './ExpressCorsMiddlewareGenerator'

export function expressCorsMiddleware(globalConfig: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressCorsMiddlewareGenerator(globalConfig)
}
