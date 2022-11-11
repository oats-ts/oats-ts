import { partialContentSdk } from '../sdks'
import { testPartialContentServer } from '../servers'

describe('Partials', () => {
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
  it('should handle empty response body', async () => {
    const response = await partialContentSdk.missingBody()
    expect(response).toEqual({ statusCode: 200 })
  })
})
