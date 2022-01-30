import { HttpTerminator } from 'http-terminator'
import { TestServerInput } from '.'
import { startExpressServer } from './startExpressServer'
import { stopExpressServer } from './stopExpressServer'

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
