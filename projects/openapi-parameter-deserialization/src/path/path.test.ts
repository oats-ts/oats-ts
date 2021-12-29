import { createPathTestSuite } from './path.testutils'
import { labelTestData } from './testdata/label.testdata'
import { labelTestParsers } from './testdata/label.testparsers'
import { matrixTestData } from './testdata/matrix.testdata'
import { matrixTestParsers } from './testdata/matrix.testparsers'
import { simpleTestData } from './testdata/simple.testdata'
import { simpleTestParsers } from './testdata/simple.testparsers'

describe('path', () => {
  createPathTestSuite('path.simple', simpleTestParsers, simpleTestData)
  createPathTestSuite('path.label', labelTestParsers, labelTestData)
  createPathTestSuite('path.matrix', matrixTestParsers, matrixTestData)
})
