import { RequestHandler } from 'express'

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
