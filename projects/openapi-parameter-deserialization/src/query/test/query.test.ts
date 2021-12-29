import { formTestParsers } from './form.testparsers'
import { formTestData } from './form.testdata'
import { deepObjectTestParsers } from './deepObject.testparsers'
import { deepObjectTestData } from './deepObject.testdata'
import { pipeDelimitedTestParsers } from './pipeDelimited.testparsers'
import { pipeDelimitedTestData } from './pipeDelimited.testdata'
import { spaceDelimitedTestParsers } from './spaceDelimited.testparsers'
import { spaceDelimitedTestData } from './spaceDelimited.testdata'

import { createQueryDeserializer } from '../createQueryDeserializer'
import { ParameterObject, QueryDeserializers } from '../../types'
import { createTestSuiteFactory } from '../../testutils'
import { QueryTestData } from './query.testutils'

export const createQueryParserTest = <Data extends ParameterObject>(
  name: string,
  config?: QueryDeserializers<Data>,
  data?: QueryTestData<Data>,
): void => {
  if (config === undefined || data === undefined) {
    return
  }
  describe(name, () => {
    if (data.data.length > 0) {
      it.each(data.data)('should parse to %j, given query: %j', (expected: Data, url: string) => {
        const parser = createQueryDeserializer(config)
        const [issues, data] = parser(url)
        expect(issues).toEqual([])
        expect(data).toEqual(expected)
      })
    }
    if (data.error.length > 0) {
      it.each(data.error)('should produce issues, given query: %j', (url: string) => {
        const parser = createQueryDeserializer(config)
        const [issues, data] = parser(url)
        expect(issues).not.toHaveLength(0)
        expect(data).toBe(undefined)
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
