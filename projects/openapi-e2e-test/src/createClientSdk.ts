import { TestClientSdk } from './openapi/sdk/TestClientSdk'
import { validate } from '@oats-ts/validators'
import { body, headers, mimeType, statusCode, serialize, request } from '@oats-ts/openapi-http-client/lib/node-fetch'
import { TestSdk } from './openapi/sdk/TestSdk'

export function createClientSdk(): TestSdk {
  return new TestClientSdk({
    baseUrl: 'http://localhost:3333',
    body,
    headers,
    mimeType,
    statusCode,
    serialize,
    validate,
    request: request(),
  })
}
