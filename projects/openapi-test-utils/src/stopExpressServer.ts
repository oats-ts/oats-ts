import { HttpTerminator } from 'http-terminator'

export async function stopExpressServer(terminator?: HttpTerminator): Promise<void> {
  if (!terminator) {
    throw new TypeError('Server or terminator not created')
  }
  return terminator.terminate()
}
