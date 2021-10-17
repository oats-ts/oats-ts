import { NextFunction, Request, Response, Router } from 'express'

export const sampleOperationRoute: Router = Router().post(
  '/sample/path/:pathParam',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {},
)
