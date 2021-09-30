import { validate } from '@oats-ts/validators'
import { body, headers, mimeType, statusCode, serialize, request } from '@oats-ts/openapi-http-client/lib/node-fetch'
import { ApiImpl } from './openapi/api/ApiImpl'

describe('Api', () => {
  const api = new ApiImpl({
    baseUrl: 'http://localhost:3000',
    body,
    headers,
    mimeType,
    statusCode,
    serialize,
    validate,
    request: request(),
  })

  it('should getSimpleNamedObject', async () => {
    const response = await api.getSimpleNamedObject()
    if (response.statusCode === 200) {
      expect(typeof response.body).toBe('object')
      expect(typeof response.body.stringProperty).toBe('string')
      expect(typeof response.body.numberProperty).toBe('number')
      expect(typeof response.body.booleanProperty).toBe('boolean')
    } else {
      fail('Unexpected status code.')
    }
  })

  it('should postSimpleNamedObject', async () => {
    const response = await api.postSimpleNamedObject({
      body: { booleanProperty: false, numberProperty: 1, stringProperty: 'hi' },
      mimeType: 'application/json',
    })
    expect(response.statusCode).toBe(200)
    expect(typeof response.body).toBe('object')
  })

  it('should getWithPathParams', async () => {
    const response = await api.getWithPathParams({
      path: {
        stringInPath: 'foo',
        numberInPath: 1,
        booleanInPath: true,
        enumInPath: 'racoon',
      },
    })
    expect(response.statusCode).toBe(200)
    expect(typeof response.body).toBe('object')
  })

  it('should getWithQueryParams', async () => {
    const response = await api.getWithQueryParams({
      query: {
        stringInQuery: 'foo',
        numberInQuery: 1,
        booleanInQuery: true,
        enumInQuery: 'cat',
      },
    })
    expect(response.statusCode).toBe(200)
    expect(typeof response.body).toBe('object')
  })

  it('should getWithHeaderParams', async () => {
    const response = await api.getWithHeaderParams({
      headers: {
        'X-String-In-Headers': 'foo',
        'X-Number-In-Headers': 12,
        'X-Boolean-In-Headers': true,
        'X-Enum-In-Headers': 'bear',
      },
    })
    expect(response.statusCode).toBe(200)
    expect(typeof response.body).toBe('object')
  })

  it('should getWithMultipleResponses', async () => {
    const result = await api.getWithMultipleResponses()
    if (result.statusCode === 200) {
      expect(typeof result.body).toBe('object')
    }
  })
})
