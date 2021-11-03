import { validate } from '@oats-ts/validators'
import { body, headers, mimeType, statusCode, serialize, request } from '@oats-ts/openapi-http-client/lib/node-fetch'
import { TestClientSdk } from './openapi/sdk/TestClientSdk'

describe('Sdk', () => {
  const sdk = new TestClientSdk({
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
    await sdk.simplePathParameters({})
  })
})
