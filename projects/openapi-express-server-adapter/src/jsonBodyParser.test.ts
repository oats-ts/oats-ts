import express, { Request, Response, NextFunction } from 'express'
import fetch from 'node-fetch'
import { Server } from 'http'
import { createHttpTerminator, HttpTerminator } from 'http-terminator'
import { jsonBodyParser } from './jsonBodyParser'

function createServer(): Server {
  const app = express()
  app.use(jsonBodyParser())
  app.post('/foo', (req: Request, res: Response) => res.status(200).json({ body: req.body }))
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => res.status(400).json({ error: err.message }))
  return app.listen(5555)
}

describe('jsonBodyParser', () => {
  let terminator: HttpTerminator
  let server: Server

  beforeEach(() => {
    server = createServer()
    terminator = createHttpTerminator({ server })
  })

  afterEach(async () => {
    await terminator.terminate()
  })

  it('should parse proper json body', async () => {
    const response = await fetch('http://localhost:5555/foo', {
      method: 'POST',
      body: '{"a": "b"}',
      headers: {
        'content-type': 'application/json',
      },
    })
    const body = await response.json()
    expect(body).toEqual({ body: { a: 'b' } })
  })

  it('should error out with non-parseable headers', async () => {
    const response = await fetch('http://localhost:5555/foo', {
      method: 'POST',
      body: '{"a"',
      headers: {
        'content-type': 'application/json',
      },
    })
    const body = (await response.json()) as any
    expect(typeof body.error).toBe('string')
  })

  // TODO add more tests, these are just smoke tests...
})
