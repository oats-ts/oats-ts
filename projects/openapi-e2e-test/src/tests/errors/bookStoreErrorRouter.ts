import { Router, Request, Response, NextFunction } from 'express'
import { defaultBooks } from '../bookStore/bookStore.testdata'

// Custom routes to allow producing responses the Oats server side code wouldn't let us.
export const bookStoreErrorRouter: Router = Router()
  .post('/books', async (_request: Request, response: Response, _next: NextFunction): Promise<void> => {
    response.status(412).header('content-type', 'application/json').send(JSON.stringify(defaultBooks[0]!))
  })
  .get('/books/:bookId', async (_request: Request, response: Response, _next: NextFunction): Promise<void> => {
    response.status(200).header('content-type', 'peepee/poopoo').send(JSON.stringify(defaultBooks[0]!))
  })
  .get('/books', async (_request: Request, response: Response, _next: NextFunction): Promise<void> => {
    response
      .status(200)
      .header('content-type', 'application/json')
      .header('x-length', 'foo')
      .send(JSON.stringify({ foo: 'hi' }))
  })
