import { ApiImpl } from './generated/api'
import { nodeFetchResponseParser, defaultBodySerializer, nodeFetchAdapter } from '@oats-ts/http/lib/node-fetch'

describe('Api', () => {
  const api = new ApiImpl({
    baseUrl: 'http://localhost:3000',
    parse: nodeFetchResponseParser,
    serialize: defaultBodySerializer,
    request: nodeFetchAdapter(),
  })

  it('should do something', async () => {
    const response = await api.getCatDog({ query: { foo: 'ho' } })
    if (response.statusCode === 200) {
      expect(typeof response.body).toBe('object')
      expect(typeof response.body.stringProperty).toBe('string')
      expect(typeof response.body.numberProperty).toBe('number')
      expect(typeof response.body.booleanProperty).toBe('boolean')
    } else {
      fail('Unexpected status code.')
    }
  })
})
