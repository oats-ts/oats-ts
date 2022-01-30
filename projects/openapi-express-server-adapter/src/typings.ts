import { Request, Response, NextFunction } from 'express'

export type ExpressToolkit = {
  request: Request
  response: Response
  next: NextFunction
}
