import {
  randomPathParameters,
  randomFormQueryParameters,
  randomDelimitedQueryParameters,
  randomDeepObjectQueryParameters,
  randomHeaderParameters,
  randomCookieParameters,
  defaultCookies,
} from './parameters.testdata'
// import { has, range } from 'lodash'
import { testParametersServer } from '../servers'
import { parametersSdk } from '../sdks'
// import { REPEATS } from '../constants'
import crypto from 'crypto'

describe('Parameters', () => {
  testParametersServer()
  const repeats = [1] //range(1, REPEATS + 1)

  function hash(input: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex')
  }

  it('should create the same hash for referentially different inputs', () => {
    expect(hash({ foo: 'bar' })).toBe(hash({ foo: 'bar' }))
  })

  describe('path', () => {
    describe('simple', () => {
      it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const path = randomPathParameters()
        const response = await parametersSdk.simplePathParameters({ path })
        expect(response.body).toEqual(path)
      })
    })
    describe('label', () => {
      it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const path = randomPathParameters()
        const response = await parametersSdk.labelPathParameters({ path })
        expect(response.body).toEqual(path)
      })
    })
    describe('marix', () => {
      it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const path = randomPathParameters()
        const response = await parametersSdk.matrixPathParameters({ path })
        expect(response.body).toEqual(path)
      })
    })
  })
  describe('query', () => {
    describe('form', () => {
      it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const query = randomFormQueryParameters()
        const response = await parametersSdk.formQueryParameters({ query })
        expect(response.body).toEqual(query)
      })
    })
    describe('spaceDelimited', () => {
      it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const query = randomDelimitedQueryParameters()
        const response = await parametersSdk.spaceDelimitedQueryParameters({ query })
        expect(response.body).toEqual(query)
      })
    })
    describe('pipeDelimited', () => {
      it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const query = randomDelimitedQueryParameters()
        const response = await parametersSdk.pipeDelimitedQueryParameters({ query })
        expect(response.body).toEqual(query)
      })
    })
    describe('deepObject', () => {
      it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const query = randomDeepObjectQueryParameters()
        const response = await parametersSdk.deepObjectQueryParameters({ query })
        expect(response.body).toEqual(query)
      })
    })
  })
  describe('header', () => {
    describe('simple', () => {
      it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const headers = randomHeaderParameters()
        const response = await parametersSdk.simpleHeaderParameters({ headers })
        expect(response.body).toEqual(headers)
      })
    })
  })
  describe('response headers', () => {
    describe('simple', () => {
      it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const body = randomHeaderParameters()
        const response = await parametersSdk.simpleResponseHeaderParameters({ body, mimeType: 'application/json' })
        expect(response.statusCode).toBe(200)
        if (response.statusCode === 200) {
          expect(response.headers).toEqual(body)
        }
        expect(response.body).toEqual({ ok: true })
      })
    })
  })
  xdescribe('cookies', () => {
    describe('simple', () => {
      it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
        const reqCookies = randomCookieParameters()
        const response = await parametersSdk.formCookieParameters({ cookies: reqCookies })
        if (response.statusCode === 200) {
          expect(response.body).toEqual(reqCookies)
          expect(response.cookies?.optStr?.value).toBe(reqCookies.optStr ?? defaultCookies.optStr)
          expect(response.cookies?.optBool?.value).toBe(reqCookies.optBool ?? defaultCookies.optBool)
          expect(response.cookies?.optNum?.value).toBe(reqCookies.optNum ?? defaultCookies.optNum)
          expect(response.cookies?.optEnm?.value).toBe(reqCookies.optEnm ?? defaultCookies.optEnm)
        }
        expect(response.statusCode).toBe(200)
      })
    })
  })
})
