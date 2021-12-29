import { labelTestData } from './label.testdata'
import { labelTestParsers } from './label.testparsers'
import { matrixTestData } from './matrix.testdata'
import { matrixTestParsers } from './matrix.testparsers'
import { simpleTestData } from './simple.testdata'
import { simpleTestParsers } from './simple.testparsers'

import { pathToRegexp } from 'path-to-regexp'
import { createPathDeserializer } from '../createPathDeserializer'
import { ParameterObject, PathDeserializers } from '../../types'
import { createTestSuiteFactory } from '../../testutils'
import { PathTestData } from './path.testutils'

const REGEXP = pathToRegexp('/test/:value/stuff')
const NAMES = ['value']

export const createPathParserTest = <Data extends ParameterObject>(
  name: string,
  config?: PathDeserializers<Data>,
  data?: PathTestData<Data>,
): void => {
  if (config === undefined || data === undefined) {
    return
  }
  describe(name, () => {
    if (data.data.length > 0) {
      it.each(data.data)('should parse to %j, given path: %j', (expected: Data, url: string) => {
        const parser = createPathDeserializer(NAMES, REGEXP, config)
        const [issues, data] = parser(url)
        expect(issues).toEqual([])
        expect(data).toEqual(expected)
      })
    }
    if (data.error.length > 0) {
      it.each(data.error)('should produce issues, given path: %j', (url: string) => {
        const parser = createPathDeserializer(NAMES, REGEXP, config)
        const [issues, data] = parser(url)
        expect(issues).not.toHaveLength(0)
        expect(data).toBe(undefined)
      })
    }
  })
}

export const createPathTestSuite = createTestSuiteFactory(createPathParserTest)

describe('path', () => {
  createPathTestSuite('simple', simpleTestParsers, simpleTestData)
  createPathTestSuite('label', labelTestParsers, labelTestData)
  createPathTestSuite('matrix', matrixTestParsers, matrixTestData)
})
