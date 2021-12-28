import { createTestSuite } from './query.testutils'
import { formTestParsers } from './testdata/form.testparsers'
import { formTestData } from './testdata/form.testdata'
import { deepObjectTestParsers } from './testdata/deepObject.testparsers'
import { deepObjectTestData } from './testdata/deepObject.testdata'
import { pipeDelimitedTestParsers } from './testdata/pipeDelimited.testparsers'
import { pipeDelimitedTestData } from './testdata/pipeDelimited.testdata'
import { spaceDelimitedTestParsers } from './testdata/spaceDelimited.testparsers'
import { spaceDelimitedTestData } from './testdata/spaceDelimited.testdata'

createTestSuite('query.form', formTestParsers, formTestData)
createTestSuite('query.deepObject', deepObjectTestParsers, deepObjectTestData)
createTestSuite('query.pipeDelimited', pipeDelimitedTestParsers, pipeDelimitedTestData)
createTestSuite('query.spaceDelimited', spaceDelimitedTestParsers, spaceDelimitedTestData)
