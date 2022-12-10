import {
  randomHeaderParameters,
  randomPathParameters,
  randomQueryAndCookieParameters,
} from './contentParameters.testdata'
import { testContentParametersServer } from '../servers'
import { contentParametersSdk } from '../sdks'
import { range } from 'lodash'
import { REPEATS } from '../constants'

describe('Content Parameters', () => {
  testContentParametersServer()
  const repeats = range(1, REPEATS + 1)

  describe('path', () => {
    it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
      const path = randomPathParameters()
      const response = await contentParametersSdk.pathParameters({ path })
      expect(response.body).toEqual(path)
    })
  })
  describe('query', () => {
    it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
      const query = randomQueryAndCookieParameters()
      const response = await contentParametersSdk.queryParameters({ query })
      expect(response.body).toEqual(query)
    })
  })
  describe('header', () => {
    it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
      const headers = randomHeaderParameters()
      const response = await contentParametersSdk.headerParameters({ headers })
      expect(response.body).toEqual(headers)
    })
  })
  describe('cookie', () => {
    it.each(repeats)('(#%d) should properly serialize and deserialize with random test data', async () => {
      const cookies = randomQueryAndCookieParameters()
      const response = await contentParametersSdk.cookieParameters({ cookies })
      expect(response.body).toEqual(cookies)
    })
  })
})
