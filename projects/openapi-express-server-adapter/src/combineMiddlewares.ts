import { Handler, Request, Response, NextFunction } from 'express'

/**
 * Combine the input middlewares, so that they run after one another in sequence.
 * This is done without any bells and whistles, check out an alternative library.
 *
 * Simplified version of https://github.com/ljwrer/middleware-series
 *
 * @param middlewares The middlewares
 * @returns A single middleware that's a composition of the input middlewares and run in sequence.
 */
export const combineMiddlewares =
  (...middlewares: Handler[]): Handler =>
  (request: Request, response: Response, next: NextFunction): void => {
    const _middlewares = Array.from(middlewares)
    function step(middleware?: Handler): void {
      if (middleware === undefined) {
        return
      }
      try {
        middleware(request, response, (error: any) => {
          if (error) {
            next(error)
          } else {
            step(_middlewares.shift())
          }
        })
      } catch (error) {
        next(error)
      }
    }
    step(_middlewares.shift())
  }
