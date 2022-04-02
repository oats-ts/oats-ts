import { Request, Response, NextFunction, text } from 'express'
import { combineMiddlewares } from './combineMiddlewares'

export type JsonBodyParserOptions = Parameters<typeof text>[0]

function jsonParserMiddleware(request: Request, _: Response, next: NextFunction): void {
  const { body } = request
  // Filter out any undesireable use-case with which we can't do anything.
  if (body === null || body === undefined || typeof body !== 'string' || body.length === 0) {
    request.body = undefined
    return next()
  }
  // Try to parse the body, delegate to the next handler on success, delegate the error on failure
  try {
    request.body = JSON.parse(body)
    next()
  } catch (error) {
    next(error)
  }
}

/**
 * JSON middleware that doesn't treat empty / non existing request bodies as empty objects.
 *
 * Under the hood it builds on express's text body parser, attempts to parse the request body,
 * Using JSON.parse, and if it succeeds, puts the result on request.body.
 *
 * @param options Standard text body parser options.
 * @returns A body parser fit for usage with oats.
 */
export const jsonBodyParser = (options: JsonBodyParserOptions = {}) =>
  combineMiddlewares(
    text({
      ...options,
      type: options.type ?? 'application/json',
    }),
    jsonParserMiddleware,
  )
