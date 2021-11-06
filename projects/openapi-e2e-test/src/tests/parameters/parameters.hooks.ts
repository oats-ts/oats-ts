import { ExpressServerConfiguration } from '@oats-ts/openapi-http-server/lib/express'
import express from 'express'
import { Server } from 'http'
import { createHttpTerminator, HttpTerminator } from 'http-terminator'
import { createParametersMainRoute } from '../../generated/Parameters'
import { ParametersApiImpl } from '../../ParametersApiImpl'

async function start(): Promise<HttpTerminator> {
  const app = express()
  app.use(express.json())
  app.use(createParametersMainRoute(new ParametersApiImpl(), new ExpressServerConfiguration()))
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(3333, () => resolve(s))
  })
  return createHttpTerminator({
    gracefulTerminationTimeout: 500,
    server,
  })
}

async function stop(terminator?: HttpTerminator): Promise<void> {
  if (!terminator) {
    throw new TypeError('Server or terminator not created')
  }
  return terminator.terminate()
}

export function manageParametersLifecycle() {
  let terminator: HttpTerminator | undefined = undefined
  beforeAll(async () => {
    terminator = await start()
  })
  afterAll(async () => {
    await stop(terminator)
  })
}
