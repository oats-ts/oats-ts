import { NextFunction, Request, Response, Router } from 'express'

export const getSimpleNamedObjectRoute: Router = Router().get(
  '/simple-named-object',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {},
)
