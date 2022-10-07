import chai from 'chai'
import { FetchClientAdapter } from '@oats-ts/openapi-fetch-client-adapter'
import { HttpMethod } from '@oats-ts/openapi-http'
import { HttpMethodsSdkImpl } from '../generated/methods/sdkImpl'
import { HttpMethodsSdk } from '../generated/methods/sdkType'
import { PATH } from '../tests/constants'

describe('Http methods', () => {
  const sdk = new HttpMethodsSdkImpl(new FetchClientAdapter({ url: `${PATH}/methods` }))

  const methods: [HttpMethod, HttpMethodsSdk[keyof HttpMethodsSdk]][] = [
    ['get', () => sdk.getMethod()],
    ['post', () => sdk.postMethod()],
    ['put', () => sdk.putMethod()],
    ['patch', () => sdk.patchMethod()],
    ['delete', () => sdk.deleteMethod()],
  ]

  methods.forEach(([httpMethod, apiFn]) =>
    it(httpMethod, async () => {
      const response = await apiFn()
      chai.expect(response.body.methodUsed.toLowerCase()).to.be.eq(httpMethod)
    }),
  )
})
