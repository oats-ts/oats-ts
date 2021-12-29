import { simpleTestData } from './simple.testdata'
import { simpleTestParsers } from './simple.testparsers'
import { createHeaderDeserializer } from '../createHeaderDeserializer'
import { ParameterObject, HeaderDeserializers, RawHeaders } from '../../types'
import { createTestSuiteFactory } from '../../testutils'
import { HeaderTestData } from './header.testutils'

export function createHeaderParserTest<Data extends ParameterObject>(
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
        const [issues, data] = parser(url)
        expect(issues).toEqual([])
        expect(data).toEqual(expected)
      })
    }
    if (data.error.length > 0) {
      it.each(data.error)('should produce issues, given headers: %j', (url: RawHeaders) => {
        const parser = createHeaderDeserializer(config)
        const [issues, data] = parser(url)
        expect(issues).not.toHaveLength(0)
        expect(data).toBe(undefined)
      })
    }
  })
}

export const createHeaderTestSuite = createTestSuiteFactory(createHeaderParserTest)

describe('header', () => {
  createHeaderTestSuite('simple', simpleTestParsers, simpleTestData)
})
