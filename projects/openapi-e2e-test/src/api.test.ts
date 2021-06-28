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
    if (response.statusCode === 200) {
      expect(typeof response.body).toBe('object')
      expect(typeof response.body.stringProperty).toBe('string')
      expect(typeof response.body.numberProperty).toBe('number')
      expect(typeof response.body.booleanProperty).toBe('boolean')
    } else {
      fail('Unexpected status code.')
    }
  })

  xit('should getWithPathParams', async () => {
    const response = await api.getWithPathParams({
      path: {
        stringInPath: 'foo',
        numberInPath: 1,
        booleanInPath: true,
        arrayInPath: ['a', 'b'],
        objectInPath: {
          b: false,
          n: 12,
          s: 'bar',
        },
      },
    })
    if (response.statusCode === 200) {
      expect(typeof response.body).toBe('object')
    } else {
      fail('Unexpected status code.')
    }
  })
})
