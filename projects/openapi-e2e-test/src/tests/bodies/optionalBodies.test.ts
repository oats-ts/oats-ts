import { partialContentSdk } from '../sdks'
import { testPartialContentServer } from '../servers'

describe('Optional request bodies', () => {
  testPartialContentServer()

  it('should handle empty request body', async () => {
    const response = await partialContentSdk.optionalRequestBody({})
    expect(response.body).toEqual({})
  })
  it('should handle non-empty request body', async () => {
    const response = await partialContentSdk.optionalRequestBody({
      mimeType: 'application/json',
      body: { foo: 'hi' },
    })
    expect(response.body).toEqual({ foo: 'hi' })
  })
})
