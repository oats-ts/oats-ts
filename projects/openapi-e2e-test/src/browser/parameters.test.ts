import { FetchClientAdapter } from '@oats-ts/openapi-fetch-client-adapter'
import chai from 'chai'
import { ParametersSdkImpl } from '../generated/parameters/sdkImpl'
import { PATH } from '../tests/constants'
import { randomPathParameters } from '../tests/parameters/parameters.testdata'

export const parametersSdk = new ParametersSdkImpl(new FetchClientAdapter({ url: PATH }))

describe('Parameters', () => {
  describe('path', () => {
    describe('simple', () => {
      it('should boo', async () => {
        const path = randomPathParameters()
        const response = await parametersSdk.simplePathParameters({ path })
        console.log(path, response.body)
        chai.expect(response.body).to.deep.equal(path)
      })
    })
    describe('label', () => {})
    describe('marix', () => {})
  })
  describe('query', () => {
    describe('form', () => {})
    describe('spaceDelimited', () => {})
    describe('pipeDelimited', () => {})
    describe('deepObject', () => {})
  })
  describe('header', () => {
    describe('simple', () => {})
  })
  describe('response headers', () => {
    describe('simple', () => {})
  })
  describe('cookies', () => {
    describe('simple', () => {})
  })
})
