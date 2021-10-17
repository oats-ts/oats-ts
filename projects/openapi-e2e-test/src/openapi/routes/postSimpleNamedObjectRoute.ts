import { NextFunction, Request, Response, Router } from 'express'

export const postSimpleNamedObjectRoute: Router = Router().post(
  '/simple-named-object',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {},
)
