import { formTestParsers } from './formTestParsers'
import { formTestData } from './formTestData'
import { deepObjectTestParsers } from './deepObjectTestParsers'
import { deepObjectTestData } from './deepObjectTestData'
import { pipeDelimitedTestParsers } from './pipeDelimitedTestParsers'
import { pipeDelimitedTestData } from './pipeDelimitedTestData'
import { spaceDelimitedTestParsers } from './spaceDelimitedTestParsers'
import { spaceDelimitedTestData } from './spaceDelimitedTestData'

import { createQueryDeserializer } from '../createQueryDeserializer'
import { ParameterObject, QueryValueDeserializers } from '../../types'
import { createTestSuiteFactory } from '../../test/testUtils'
import { QueryTestData } from './queryTestUtils'
import { getData, getIssues, isFailure } from '@oats-ts/try'

export const createQueryParserTest = <Data extends ParameterObject>(
  name: string,
  config?: QueryValueDeserializers<Data>,
  data?: QueryTestData<Data>,
): void => {
  if (config === undefined || data === undefined) {
    return
  }
  describe(name, () => {
    if (data.data.length > 0) {
      it.each(data.data)('should parse to %j, given query: %j', (expected: Data, url: string) => {
        const parser = createQueryDeserializer(config)
        const result = parser(url)
        expect(getData(result)).toEqual(expected)
      })
    }
    if (data.error.length > 0) {
      it.each(data.error)('should produce issues, given query: %j', (url: string) => {
        const parser = createQueryDeserializer(config)
        const result = parser(url)
        expect(isFailure(result)).toBe(true)
        expect(getIssues(result)).not.toHaveLength(0)
      })
    }
  })
}

const createQueryTestSuite = createTestSuiteFactory(createQueryParserTest)

describe('query', () => {
  createQueryTestSuite('form', formTestParsers, formTestData)
  createQueryTestSuite('deepObject', deepObjectTestParsers, deepObjectTestData)
  createQueryTestSuite('pipeDelimited', pipeDelimitedTestParsers, pipeDelimitedTestData)
  createQueryTestSuite('spaceDelimited', spaceDelimitedTestParsers, spaceDelimitedTestData)
})
