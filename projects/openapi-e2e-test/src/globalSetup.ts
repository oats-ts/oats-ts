import { ExpressServerConfiguration } from '@oats-ts/openapi-http-server/lib/express'
import express from 'express'
import { Server } from 'http'
import { createHttpTerminator } from 'http-terminator'
import { createMainRoute } from './openapi/routes/createMainRoute'

module.exports = async function start(): Promise<void> {
  const app = express()
  app.use(express.json())
  app.use(createMainRoute(undefined as any, new ExpressServerConfiguration()))
  const _global = global as any
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(3333, () => resolve(s))
  })
  _global._server = createHttpTerminator({
    gracefulTerminationTimeout: 500,
    server,
  })
}
