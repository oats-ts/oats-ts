import { manageServerLifecycle } from '../common/server.hooks'
import { NodeFetchClientConfiguration } from '@oats-ts/openapi-http-client/lib/node-fetch'
import { ExpressServerConfiguration } from '@oats-ts/openapi-http-server/lib/express'
import { HttpMethodsApiImpl } from './HttpMethodsApiImpl'
import { createHttpMethodsMainRoute, HttpMethodsClientSdk, HttpMethodsSdk } from '../../generated/HttpMethods'
import { HttpMethod } from '@oats-ts/openapi-http'

describe('Http methods', () => {
  manageServerLifecycle(createHttpMethodsMainRoute(new HttpMethodsApiImpl(), new ExpressServerConfiguration()))
  const sdk = new HttpMethodsClientSdk(new NodeFetchClientConfiguration('http://localhost:3333'))
  const methods: [HttpMethod, HttpMethodsSdk[keyof HttpMethodsSdk]][] = [
    ['get', () => sdk.getMethod()],
    ['post', () => sdk.postMethod()],
    ['put', () => sdk.putMethod()],
    ['patch', () => sdk.patchMethod()],
    ['options', () => sdk.optionsMethod()],
    ['delete', () => sdk.deleteMethod()],
  ]

  it.each(methods)('%s', async (httpMethod, apiMethod) => {
    const response = await apiMethod()
    expect(response.body.methodUsed.toLowerCase()).toEqual(httpMethod)
  })
})
