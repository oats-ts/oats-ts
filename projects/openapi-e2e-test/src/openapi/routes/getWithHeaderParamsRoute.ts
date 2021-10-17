import { NextFunction, Request, Response, Router } from 'express'

export const getWithHeaderParamsRoute: Router = Router().get(
  '/header-params',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {},
)
