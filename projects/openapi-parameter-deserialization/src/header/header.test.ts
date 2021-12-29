import { createHeaderTestSuite } from './header.testutils'
import { simpleTestData } from './testdata/simple.testdata'
import { simpleTestParsers } from './testdata/simple.testparsers'

describe('header', () => {
  createHeaderTestSuite('simple', simpleTestParsers, simpleTestData)
})
