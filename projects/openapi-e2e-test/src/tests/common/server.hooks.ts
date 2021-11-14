import express, { Router } from 'express'
import { Server } from 'http'
import { createHttpTerminator, HttpTerminator } from 'http-terminator'
import { customBodyParsers } from './customBodyParsers'

async function start(route: Router): Promise<HttpTerminator> {
  const app = express()
  app.use(customBodyParsers.json())
  app.use(customBodyParsers.yaml())
  app.use(route)
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

export function manageServerLifecycle(route: Router) {
  let terminator: HttpTerminator | undefined = undefined
  beforeAll(async () => {
    terminator = await start(route)
  })
  afterAll(async () => {
    await stop(terminator)
  })
}
