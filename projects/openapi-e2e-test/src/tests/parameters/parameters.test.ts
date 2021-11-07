import { manageParametersLifecycle } from './parameters.hooks'
import { validate } from '@oats-ts/validators'
import { body, headers, mimeType, statusCode, serialize, request } from '@oats-ts/openapi-http-client/lib/node-fetch'
import { ParametersClientSdk } from '../../generated/Parameters'
import {
  randomPathParameters,
  randomFormQueryParameters,
  randomDelimitedQueryParameters,
  randomDeepObjectQueryParameters,
  randomHeaderParameters,
} from './parameters.testdata'
import { range } from 'lodash'

describe('Parameters', () => {
  manageParametersLifecycle()
  const sdk = new ParametersClientSdk({
    baseUrl: 'http://localhost:3333',
    body,
    headers,
    mimeType,
    statusCode,
    serialize,
    validate,
    request: request(),
  })

  const data = range(1, process.env['REPEATS'] ? parseInt(process.env['REPEATS']) + 1 : 11)

  describe('path', () => {
    describe('simple', () => {
      it.each(data)('should properly serialize and deserialize with random test data (#%d)', async () => {
        const path = randomPathParameters()
        const response = await sdk.simplePathParameters({ path })
        expect(response.body).toEqual(path)
      })
    })
    describe('label', () => {
      it.each(data)('should properly serialize and deserialize with random test data (#%d)', async () => {
        const path = randomPathParameters()
        const response = await sdk.labelPathParameters({ path })
        expect(response.body).toEqual(path)
      })
    })
    describe('marix', () => {
      it.each(data)('should properly serialize and deserialize with random test data (#%d)', async () => {
        const path = randomPathParameters()
        const response = await sdk.matrixPathParameters({ path })
        expect(response.body).toEqual(path)
      })
    })
  })
  describe('query', () => {
    describe('form', () => {
      it.each(data)('should properly serialize and deserialize with random test data (#%d)', async () => {
        const query = randomFormQueryParameters()
        const response = await sdk.formQueryParameters({ query })
        expect(response.body).toEqual(query)
      })
    })
    describe('spaceDelimited', () => {
      it.each(data)('should properly serialize and deserialize with random test data (#%d)', async () => {
        const query = randomDelimitedQueryParameters()
        const response = await sdk.spaceDelimitedQueryParameters({ query })
        expect(response.body).toEqual(query)
      })
    })
    describe('pipeDelimited', () => {
      it.each(data)('should properly serialize and deserialize with random test data (#%d)', async () => {
        const query = randomDelimitedQueryParameters()
        const response = await sdk.pipeDelimitedQueryParameters({ query })
        expect(response.body).toEqual(query)
      })
    })
    describe('deepObject', () => {
      it.each(data)('should properly serialize and deserialize with random test data (#%d)', async () => {
        const query = randomDeepObjectQueryParameters()
        const response = await sdk.deepObjectQueryParameters({ query })
        expect(response.body).toEqual(query)
      })
    })
  })
  describe('header', () => {
    describe('simple', () => {
      it.each(data)('should properly serialize and deserialize with random test data (#%d)', async () => {
        const headers = randomHeaderParameters()
        const response = await sdk.simpleHeaderParameters({ headers })
        expect(response.body).toEqual(headers)
      })
    })
  })
})
