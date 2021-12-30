import { simpleTestData } from './simpleTestData'
import { simpleTestParsers } from './simpleTestParsers'
import { createHeaderDeserializer } from '../createHeaderDeserializer'
import { ParameterObject, HeaderValueDeserializers, RawHeaders } from '../../types'
import { createTestSuiteFactory } from '../../test/testUtils'
import { HeaderTestData } from './headerTestUtils'
import { isFailure, get, getIssues } from '@oats-ts/try'

export function createHeaderParserTest<Data extends ParameterObject>(
  name: string,
  config?: HeaderValueDeserializers<Data>,
  data?: HeaderTestData<Data>,
): void {
  if (config === undefined || data === undefined) {
    return
  }
  describe(name, () => {
    if (data.data.length > 0) {
      it.each(data.data)('should parse to %j, given headers: %j', (expected: Data, url: RawHeaders) => {
        const parser = createHeaderDeserializer(config)
        const result = parser(url)
        expect(get(result)).toEqual(expected)
      })
    }
    if (data.error.length > 0) {
      it.each(data.error)('should produce issues, given headers: %j', (url: RawHeaders) => {
        const parser = createHeaderDeserializer(config)
        const result = parser(url)
        expect(isFailure(result)).toBe(true)
        expect(getIssues(result)).not.toHaveLength(0)
      })
    }
  })
}

export const createHeaderTestSuite = createTestSuiteFactory(createHeaderParserTest)

describe('header', () => {
  createHeaderTestSuite('simple', simpleTestParsers, simpleTestData)
})
