import { getMockServer } from './utils/getMockServer'

module.exports = async function globalSetup() {
  const _global = global as any
  _global.server = await getMockServer()
}
