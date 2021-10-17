import { Request, Response, NextFunction } from 'express'

export type ExpressParameters = {
  request: Request
  response: Response
  next: NextFunction
}
