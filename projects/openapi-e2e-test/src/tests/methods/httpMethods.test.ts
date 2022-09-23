import { HttpMethod } from '@oats-ts/openapi-http'
import { testHttpMethodsServer } from '../servers'
import { httpMethodsSdk } from '../sdks'
import { HttpMethodsSdk } from '../../generated/methods/sdkType'

describe('Http methods', () => {
  testHttpMethodsServer()
  const methods: [HttpMethod, HttpMethodsSdk[keyof HttpMethodsSdk]][] = [
    ['get', () => httpMethodsSdk.getMethod()],
    ['post', () => httpMethodsSdk.postMethod()],
    ['put', () => httpMethodsSdk.putMethod()],
    ['patch', () => httpMethodsSdk.patchMethod()],
    ['options', () => httpMethodsSdk.optionsMethod()],
    ['delete', () => httpMethodsSdk.deleteMethod()],
  ]

  it.each(methods)('%s', async (httpMethod, apiMethod) => {
    const response = await apiMethod()
    expect(response.body.methodUsed.toLowerCase()).toEqual(httpMethod)
  })
})
