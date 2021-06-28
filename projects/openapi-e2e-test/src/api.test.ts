import { ApiImpl } from './generated/api'
import { nodeFetchResponseParser, defaultBodySerializer, nodeFetchAdapter } from '@oats-ts/http/lib/node-fetch'

describe('Api', () => {
  const api = new ApiImpl({
    baseUrl: 'http://localhost:3000',
    parse: nodeFetchResponseParser,
    serialize: defaultBodySerializer,
    request: nodeFetchAdapter(),
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
      contentType: 'application/json',
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
})
