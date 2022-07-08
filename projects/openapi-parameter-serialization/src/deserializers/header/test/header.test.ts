import { simpleTestData } from './simpleTestData'
import { simpleTestParsers } from './simpleTestParsers'
import { createHeaderDeserializer } from '../createHeaderDeserializer'
import { createTestSuiteFactory } from '../../test/testUtils'
import { HeaderTestData } from './headerTestUtils'
import { Failure, isFailure, Success } from '@oats-ts/try'
import { HeaderDeserializers, ParameterType, RawHeaders } from '../../../types'

export function createHeaderParserTest<Data extends ParameterType>(
  name: string,
  config?: HeaderDeserializers<Data>,
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
        expect((result as Success<any>).data).toEqual(expected)
      })
    }
    if (data.error.length > 0) {
      it.each(data.error)('should produce issues, given headers: %j', (url: RawHeaders) => {
        const parser = createHeaderDeserializer(config)
        const result = parser(url)
        expect(isFailure(result)).toBe(true)
        expect((result as Failure).issues).not.toHaveLength(0)
      })
    }
  })
}

export const createHeaderTestSuite = createTestSuiteFactory(createHeaderParserTest)

describe('header', () => {
  createHeaderTestSuite('simple', simpleTestParsers, simpleTestData)
})
