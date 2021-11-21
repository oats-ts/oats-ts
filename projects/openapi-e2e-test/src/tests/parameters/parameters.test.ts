import { manageServerLifecycle } from '../common/server.hooks'
import { NodeFetchClientConfiguration } from '@oats-ts/openapi-http-client/lib/node-fetch'
import { createParametersRouter, ParametersClientSdk } from '../../generated/Parameters'
import {
  randomPathParameters,
  randomFormQueryParameters,
  randomDelimitedQueryParameters,
  randomDeepObjectQueryParameters,
  randomHeaderParameters,
} from './parameters.testdata'
import { range } from 'lodash'
import { ParametersApiImpl } from './ParametersApiImpl'
import { ExpressServerConfiguration } from '@oats-ts/openapi-http-server/lib/express'

describe('Parameters', () => {
  manageServerLifecycle(createParametersRouter(new ParametersApiImpl(), new ExpressServerConfiguration()))
  const sdk = new ParametersClientSdk(new NodeFetchClientConfiguration('http://localhost:3333'))

  const data = range(1, process.env['REPEATS'] ? parseInt(process.env['REPEATS']) + 1 : 11)

  describe('path', () => {
    describe('simple', () => {
      it.each(data)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const path = randomPathParameters()
        const response = await sdk.simplePathParameters({ path })
        expect(response.body).toEqual(path)
      })
    })
    describe('label', () => {
      it.each(data)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const path = randomPathParameters()
        const response = await sdk.labelPathParameters({ path })
        expect(response.body).toEqual(path)
      })
    })
    describe('marix', () => {
      it.each(data)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const path = randomPathParameters()
        const response = await sdk.matrixPathParameters({ path })
        expect(response.body).toEqual(path)
      })
    })
  })
  describe('query', () => {
    describe('form', () => {
      it.each(data)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const query = randomFormQueryParameters()
        const response = await sdk.formQueryParameters({ query })
        expect(response.body).toEqual(query)
      })
    })
    describe('spaceDelimited', () => {
      it.each(data)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const query = randomDelimitedQueryParameters()
        const response = await sdk.spaceDelimitedQueryParameters({ query })
        expect(response.body).toEqual(query)
      })
    })
    describe('pipeDelimited', () => {
      it.each(data)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const query = randomDelimitedQueryParameters()
        const response = await sdk.pipeDelimitedQueryParameters({ query })
        expect(response.body).toEqual(query)
      })
    })
    describe('deepObject', () => {
      it.each(data)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const query = randomDeepObjectQueryParameters()
        const response = await sdk.deepObjectQueryParameters({ query })
        expect(response.body).toEqual(query)
      })
    })
  })
  describe('header', () => {
    describe('simple', () => {
      it.each(data)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const headers = randomHeaderParameters()
        const response = await sdk.simpleHeaderParameters({ headers })
        expect(response.body).toEqual(headers)
      })
    })
  })
  describe('response headers', () => {
    describe('simple', () => {
      it.each(data)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const body = randomHeaderParameters()
        const response = await sdk.simpleResponseHeaderParameters({ body, mimeType: 'application/json' })
        expect(response.headers).toEqual(body)
        expect(response.body).toEqual({ ok: true })
      })
    })
  })
})
