import { validate } from '@oats-ts/validators'
import { body, headers, mimeType, statusCode, serialize, request } from '@oats-ts/openapi-http-client/lib/node-fetch'
import { ClientSdk } from './openapi/sdk/ClientSdk'

describe('Sdk', () => {
  const sdk = new ClientSdk({
    baseUrl: 'http://localhost:3333',
    body,
    headers,
    mimeType,
    statusCode,
    serialize,
    validate,
    request: request(),
  })

  it('should do something', async () => {
    await sdk.getSimpleNamedObject()
  })
})
