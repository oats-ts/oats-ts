import { NextFunction, Request, Response, Router } from 'express'

export const getWithPathParamsRoute: Router = Router().get(
  '/path-params/:stringInPath/:numberInPath/:booleanInPath/:enumInPath/:objectInPath/:arrayInPath',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {},
)
