import { FetchClientAdapter } from '@oats-ts/openapi-fetch-client-adapter'
import { RawHttpRequest } from '@oats-ts/openapi-http'
import chai from 'chai'
import { ParametersSdkImpl } from '../generated/parameters/sdkImpl'
import { PATH } from '../tests/constants'
import {
  randomDeepObjectQueryParameters,
  randomDelimitedQueryParameters,
  randomFormQueryParameters,
  randomHeaderParameters,
  randomPathParameters,
} from '../tests/parameters/parameters.testdata'

class CookieEnablingAdapter extends FetchClientAdapter {
  protected override getRequestInit(request: RawHttpRequest): RequestInit | undefined {
    return { ...super.getRequestInit(request), credentials: 'include' }
  }
}

const REPEATS = 5

const normalParamsSdk = new ParametersSdkImpl(new FetchClientAdapter({ url: PATH }))

function s<T extends Record<string, unknown>>(object: T): T {
  return JSON.parse(JSON.stringify(object, undefined, 2))
}

function repeat(times: number, name: ((iteration: number) => string) | string, fn: () => Promise<void>) {
  for (let i = 0; i < times; i += 1) {
    it(typeof name === 'string' ? name : name(i + 1), fn)
  }
}

describe('Parameters', () => {
  describe('path', () => {
    repeat(
      REPEATS,
      (i) => `simple #${i}`,
      async () => {
        const path = randomPathParameters()
        const response = await normalParamsSdk.simplePathParameters({ path })
        if (response.statusCode === 200) {
          chai.expect(s(response.body)).to.be.deep.equal(s(path))
        }
        chai.expect(response.statusCode).to.be.equal(200)
      },
    )
    repeat(
      REPEATS,
      (i) => `label #${i}`,
      async () => {
        const path = randomPathParameters()
        const response = await normalParamsSdk.labelPathParameters({ path })
        if (response.statusCode === 200) {
          chai.expect(s(response.body)).to.be.deep.equal(s(path))
        }
        chai.expect(response.statusCode).to.be.equal(200)
      },
    )
    repeat(
      REPEATS,
      (i) => `matrix #${i}`,
      async () => {
        const path = randomPathParameters()
        const response = await normalParamsSdk.matrixPathParameters({ path })
        if (response.statusCode === 200) {
          chai.expect(s(response.body)).to.be.deep.equal(s(path))
        }
        chai.expect(response.statusCode).to.be.equal(200)
      },
    )
  })
  describe('query', () => {
    repeat(
      REPEATS,
      (i) => `form #${i}`,
      async () => {
        const query = randomFormQueryParameters()
        const response = await normalParamsSdk.formQueryParameters({ query })
        if (response.statusCode === 200) {
          chai.expect(s(response.body)).to.be.deep.equal(s(query))
        }
        chai.expect(response.statusCode).to.be.equal(200)
      },
    )
    repeat(
      REPEATS,
      (i) => `spaceDelimited #${i}`,
      async () => {
        const query = randomDelimitedQueryParameters()
        const response = await normalParamsSdk.spaceDelimitedQueryParameters({ query })
        if (response.statusCode === 200) {
          chai.expect(s(response.body)).to.be.deep.equal(s(query))
        }
        chai.expect(response.statusCode).to.be.equal(200)
      },
    )
    repeat(
      REPEATS,
      (i) => `pipeDelimited #${i}`,
      async () => {
        const query = randomDelimitedQueryParameters()
        const response = await normalParamsSdk.pipeDelimitedQueryParameters({ query })
        if (response.statusCode === 200) {
          chai.expect(s(response.body)).to.be.deep.equal(s(query))
        }
        chai.expect(response.statusCode).to.be.equal(200)
      },
    )
    repeat(
      REPEATS,
      (i) => `deepObject #${i}`,
      async () => {
        const query = randomDeepObjectQueryParameters()
        const response = await normalParamsSdk.deepObjectQueryParameters({ query })
        if (response.statusCode === 200) {
          chai.expect(s(response.body)).to.be.deep.equal(s(query))
        }
        chai.expect(response.statusCode).to.be.equal(200)
      },
    )
  })
  describe('header', () => {
    repeat(
      REPEATS,
      (i) => `simple #${i}`,
      async () => {
        const headers = randomHeaderParameters()
        const response = await normalParamsSdk.simpleHeaderParameters({ headers })
        if (response.statusCode === 200) {
          chai.expect(s(response.body)).to.be.deep.equal(s(headers))
        }
        chai.expect(response.statusCode).to.be.equal(200)
      },
    )
  })
  describe('response headers', () => {
    repeat(
      REPEATS,
      (i) => `simple #${i}`,
      async () => {
        const body = randomHeaderParameters()
        const response = await normalParamsSdk.simpleResponseHeaderParameters({ body, mimeType: 'application/json' })
        if (response.statusCode === 200) {
          chai.expect(response.headers).to.be.deep.equal(body)
        }
        chai.expect(response.statusCode).to.be.equal(200)
        chai.expect(response.body).to.be.deep.equal({ ok: true })
      },
    )
  })
  describe('cookies', () => {
    const cookieSdk = new ParametersSdkImpl(new CookieEnablingAdapter({ url: PATH }))

    it('simple', async () => {
      const response = await cookieSdk.formCookieParameters({})
      console.log(response)
    })
  })
})
