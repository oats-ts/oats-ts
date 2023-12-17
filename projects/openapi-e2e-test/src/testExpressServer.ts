import express, { Express, IRouter } from 'express'
import { HttpTerminator, createHttpTerminator } from 'http-terminator'
import { Server } from 'http'
import { tick } from '@oats-ts/openapi-common'

export type TestServerInput = {
  /** The port the server should be running on */
  port: number
  /** The express request handlers to handle the servers logic. */
  attachHandlers: (router: IRouter) => void
  /**
   * Determines which lifecycle event pair is used for starting/stopping the server
   * - all - beforeAll() starts and afterAll() stops the server
   * - each - beforeEach() starts and afterEach() stops the server
   */
  runBeforeAndAfter: 'all' | 'each'
}

export async function stopExpressServer(terminator?: HttpTerminator): Promise<any> {
  if (!terminator) {
    throw new TypeError('Server or terminator not created')
  }
  await terminator.terminate()
  return tick()
}

export async function startExpressServer(app: Express, input: TestServerInput): Promise<HttpTerminator> {
  input.attachHandlers(app)
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(input.port, () => resolve(s))
  })
  return createHttpTerminator({
    gracefulTerminationTimeout: 500,
    server,
  })
}

/**
 * Creates an express server, and hooks it's starting in the before or beforeAll,
 * and it's shutdown in the after or afterAll lifecycle events.
 */
export function testExpressServer(input: TestServerInput) {
  const app = express()
  let terminator: HttpTerminator | undefined = undefined

  const startHandler = async () => {
    terminator = await startExpressServer(app, input)
  }

  const stopHandler = async () => {
    return stopExpressServer(terminator)
  }

  if (input.runBeforeAndAfter === 'all') {
    beforeAll(startHandler)
    afterAll(stopHandler)
  } else {
    beforeEach(startHandler)
    afterEach(stopHandler)
  }
}
