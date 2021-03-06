import { labelTestData } from './labelTestData'
import { labelTestParsers } from './labelTestParsers'
import { matrixTestData } from './matrixTestData'
import { matrixTestParsers } from './matrixTestParsers'
import { simpleTestData } from './simpleTestData'
import { simpleTestParsers } from './simpleTestParsers'

import { pathToRegexp } from 'path-to-regexp'
import { createPathDeserializer } from '../createPathDeserializer'
import { createTestSuiteFactory } from '../../test/testUtils'
import { PathTestData } from './pathTestUtils'
import { Failure, isFailure, Success } from '@oats-ts/try'
import { ParameterType, PathDeserializers } from '../../../types'

const REGEXP = pathToRegexp('/test/:value/stuff')
const NAMES = ['value']

export const createPathParserTest = <Data extends ParameterType>(
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
        const result = parser(url)
        expect((result as Success<any>).data).toEqual(expected)
      })
    }
    if (data.error.length > 0) {
      it.each(data.error)('should produce issues, given path: %j', (url: string) => {
        const parser = createPathDeserializer(NAMES, REGEXP, config)
        const result = parser(url)
        expect(isFailure(result)).toBe(true)
        expect((result as Failure).issues).not.toHaveLength(0)
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
