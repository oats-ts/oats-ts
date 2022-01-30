import { FetchClientAdapter } from '@oats-ts/openapi-fetch-client-adapter'
import { HttpMethodsApiImpl } from './HttpMethodsApiImpl'
import { createHttpMethodsRouter, HttpMethodsSdkImpl, HttpMethodsSdk } from '../../generated/HttpMethods'
import { HttpMethod } from '@oats-ts/openapi-http'
import { useExpressServer } from '@oats-ts/openapi-test-utils'
import { customBodyParsers } from '../common/customBodyParsers'
import { ExpressServerAdapter } from '@oats-ts/openapi-express-server-adapter'

describe('Http methods', () => {
  useExpressServer({
    port: 3333,
    runBeforeAndAfter: 'all',
    handlers: [
      customBodyParsers.yaml(),
      customBodyParsers.json(),
      createHttpMethodsRouter(new HttpMethodsApiImpl(), new ExpressServerAdapter()),
    ],
  })
  const sdk = new HttpMethodsSdkImpl(new FetchClientAdapter('http://localhost:3333'))
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
