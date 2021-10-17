import { NextFunction, Request, Response, Router } from 'express'

export const getWithMultipleResponsesRoute: Router = Router().get(
  '/multiple-responses',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {},
)
