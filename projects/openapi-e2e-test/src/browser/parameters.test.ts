import { FetchClientAdapter } from '@oats-ts/openapi-fetch-client-adapter'
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

const REPEATS = 5
const parametersSdk = new ParametersSdkImpl(new FetchClientAdapter({ url: PATH }))

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
        const response = await parametersSdk.simplePathParameters({ path })
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
        const response = await parametersSdk.labelPathParameters({ path })
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
        const response = await parametersSdk.matrixPathParameters({ path })
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
        const response = await parametersSdk.formQueryParameters({ query })
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
        const response = await parametersSdk.spaceDelimitedQueryParameters({ query })
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
        const response = await parametersSdk.pipeDelimitedQueryParameters({ query })
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
        const response = await parametersSdk.deepObjectQueryParameters({ query })
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
        const response = await parametersSdk.simpleHeaderParameters({ headers })
        if (response.statusCode === 200) {
          chai.expect(s(response.body)).to.be.deep.equal(s(headers))
        }
        chai.expect(response.statusCode).to.be.equal(200)
      },
    )
  })
  describe('response headers', () => {
    describe('simple', () => {})
  })
  describe('cookies', () => {
    describe('simple', () => {})
  })
})
