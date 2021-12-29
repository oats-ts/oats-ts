import { simpleTestData } from './simpleTestData'
import { simpleTestParsers } from './simpleTestParsers'
import { createHeaderDeserializer } from '../createHeaderDeserializer'
import { ParameterObject, HeaderValueDeserializers, RawHeaders } from '../../types'
import { createTestSuiteFactory } from '../../test/testUtils'
import { HeaderTestData } from './headerTestUtils'

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
