import express, { RequestHandler } from 'express'
import { HttpTerminator, createHttpTerminator } from 'http-terminator'
import { Server } from 'http'

export type TestServerInput = {
  /** The port the server should be running on */
  port: number
  /** The express request handlers to handle the servers logic. */
  handlers: () => RequestHandler[]
  /**
   * Determines which lifecycle event pair is used for starting/stopping the server
   * - all - beforeAll() starts and afterAll() stops the server
   * - each - beforeEach() starts and afterEach() stops the server
   */
  runBeforeAndAfter: 'all' | 'each'
}

export async function stopExpressServer(terminator?: HttpTerminator): Promise<void> {
  if (!terminator) {
    throw new TypeError('Server or terminator not created')
  }
  return terminator.terminate()
}

export async function startExpressServer(input: TestServerInput): Promise<HttpTerminator> {
  const app = express()
  app.use(...input.handlers())
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
  let terminator: HttpTerminator | undefined = undefined
  const startHandler = async () => {
    terminator = await startExpressServer(input)
  }
  const stopHandler = async () => stopExpressServer(terminator)

  if (input.runBeforeAndAfter === 'all') {
    beforeAll(startHandler)
    afterAll(stopHandler)
  } else {
    beforeEach(startHandler)
    afterEach(stopHandler)
  }
}
