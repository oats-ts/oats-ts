import express from 'express'
import { Server } from 'http'
import { createHttpTerminator, HttpTerminator } from 'http-terminator'
import { TestServerInput } from './types'

export async function startExpressServer(input: TestServerInput): Promise<HttpTerminator> {
  const app = express()
  app.use(...input.handlers)
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(input.port, () => resolve(s))
  })
  return createHttpTerminator({
    gracefulTerminationTimeout: 500,
    server,
  })
}
