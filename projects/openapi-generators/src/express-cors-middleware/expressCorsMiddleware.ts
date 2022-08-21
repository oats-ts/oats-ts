import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressCorsMiddlewareGenerator } from './ExpressCorsMiddlewareGenerator'
import { ExpressCorsMiddlewareGeneratorConfig } from './typings'

export function expressCorsMiddleware(
  config: Partial<ExpressCorsMiddlewareGeneratorConfig & GeneratorConfig> = {},
): OpenAPIGenerator {
  return new ExpressCorsMiddlewareGenerator(config)
}
