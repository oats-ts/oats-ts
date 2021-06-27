import { resolve } from 'path'
const OpenAPIMocker = require('open-api-mocker')

export async function getMockServer() {
  const server = new OpenAPIMocker({
    port: 3000,
    schema: resolve('kitchenSink.json'),
    watch: false,
  })

  await server.validate()
  await server.mock()

  return server
}
