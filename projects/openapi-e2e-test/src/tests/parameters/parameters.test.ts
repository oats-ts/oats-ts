import { manageParametersLifecycle } from './parameters.hooks'
import { validate } from '@oats-ts/validators'
import { body, headers, mimeType, statusCode, serialize, request } from '@oats-ts/openapi-http-client/lib/node-fetch'
import { ParametersClientSdk } from '../../generated/Parameters'
import { randomPathParameters } from './parameters.testdata'

describe('Parameters', () => {
  manageParametersLifecycle()
  const sdk = new ParametersClientSdk({
    baseUrl: 'http://localhost:3333',
    body,
    headers,
    mimeType,
    statusCode,
    serialize,
    validate,
    request: request(),
  })

  describe('path', () => {
    describe('simple', () => {
      it('should properly serialize and deserialize with random test data', async () => {
        const path = randomPathParameters()
        const response = await sdk.simplePathParameters({ path })
        expect(response.body).toEqual(path)
      })
    })
    describe('label', () => {
      it('should properly serialize and deserialize with random test data', async () => {
        const path = randomPathParameters()
        const response = await sdk.labelPathParameters({ path })
        expect(response.body).toEqual(path)
      })
    })
    describe('marix', () => {
      it('should properly serialize and deserialize with random test data', async () => {
        const path = randomPathParameters()
        const response = await sdk.matrixPathParameters({ path })
        expect(response.body).toEqual(path)
      })
    })
  })
})
