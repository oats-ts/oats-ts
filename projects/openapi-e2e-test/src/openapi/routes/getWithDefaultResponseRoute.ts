import { NextFunction, Request, Response, Router } from 'express'

export const getWithDefaultResponseRoute: Router = Router().get(
  '/default-response-only',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {},
)
