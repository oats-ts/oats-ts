import { createPathTestSuite } from './path.testutils'
import { labelTestData } from './testdata/label.testdata'
import { labelTestParsers } from './testdata/label.testparsers'
import { simpleTestData } from './testdata/simple.testdata'
import { simpleTestParsers } from './testdata/simple.testparsers'

describe('path', () => {
  createPathTestSuite('path.simple', simpleTestParsers, simpleTestData)
  createPathTestSuite('path.label', labelTestParsers, labelTestData)
})
