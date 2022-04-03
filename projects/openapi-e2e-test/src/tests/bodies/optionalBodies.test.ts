import { optionalRequestBodySdk } from '../sdks'
import { testOptionalBodiesServer } from '../servers'

describe('Optional request bodies', () => {
  testOptionalBodiesServer()

  it('should handle empty request body', async () => {
    const response = await optionalRequestBodySdk.optionalRequestBody({})
    expect(response.body).toEqual({})
  })
  it('should handle non-empty request body', async () => {
    const response = await optionalRequestBodySdk.optionalRequestBody({
      mimeType: 'application/json',
      body: { foo: 'hi' },
    })
    expect(response.body).toEqual({ foo: 'hi' })
  })
})
