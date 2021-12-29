import { createPathTestSuite } from './path.testutils'
import { simpleTestData } from './testdata/simple.testdata'
import { simpleTestParsers } from './testdata/simple.testparsers'

describe('path', () => {
  createPathTestSuite('path.simple', simpleTestParsers, simpleTestData)
})
