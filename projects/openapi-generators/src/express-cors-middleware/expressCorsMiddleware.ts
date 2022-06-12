import { OpenAPIGenerator } from '../types'
import { ExpressCorsMiddlewareGenerator } from './ExpressCorsMiddlewareGenerator'

export function expressCorsMiddleware(): OpenAPIGenerator {
  return new ExpressCorsMiddlewareGenerator()
}
