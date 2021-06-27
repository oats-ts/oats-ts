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
    console.log(response)
  })
})
