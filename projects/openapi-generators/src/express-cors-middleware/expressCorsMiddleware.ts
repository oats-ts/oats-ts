import { ExpressCorsMiddlewareGenerator } from './ExpressCorsMiddlewareGenerator'

export function expressCorsMiddleware(): ExpressCorsMiddlewareGenerator {
  return new ExpressCorsMiddlewareGenerator()
}
