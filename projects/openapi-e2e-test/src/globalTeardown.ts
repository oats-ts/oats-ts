import { HttpTerminator } from 'http-terminator'

module.exports = async function stop(): Promise<void> {
  const _global = global as any
  const server: HttpTerminator = _global._server
  if (!server) {
    throw new TypeError('Server or terminator not created')
  }
  return server.terminate()
}
