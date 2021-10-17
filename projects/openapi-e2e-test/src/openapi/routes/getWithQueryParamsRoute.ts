import { NextFunction, Request, Response, Router } from 'express'

export const getWithQueryParamsRoute: Router = Router().get(
  '/query-params',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {},
)
