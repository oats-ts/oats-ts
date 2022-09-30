import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressContextMiddlewareGenerator } from './ExpressContextMiddlewareGenerator'

export function expressContextMiddleware(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressContextMiddlewareGenerator(config)
}
