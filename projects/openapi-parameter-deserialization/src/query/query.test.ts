import { createTestSuite as createQueryTestSuite } from './query.testutils'
import { formTestParsers } from './testdata/form.testparsers'
import { formTestData } from './testdata/form.testdata'
import { deepObjectTestParsers } from './testdata/deepObject.testparsers'
import { deepObjectTestData } from './testdata/deepObject.testdata'
import { pipeDelimitedTestParsers } from './testdata/pipeDelimited.testparsers'
import { pipeDelimitedTestData } from './testdata/pipeDelimited.testdata'
import { spaceDelimitedTestParsers } from './testdata/spaceDelimited.testparsers'
import { spaceDelimitedTestData } from './testdata/spaceDelimited.testdata'

describe('query', () => {
  createQueryTestSuite('query.form', formTestParsers, formTestData)
  createQueryTestSuite('query.deepObject', deepObjectTestParsers, deepObjectTestData)
  createQueryTestSuite('query.pipeDelimited', pipeDelimitedTestParsers, pipeDelimitedTestData)
  createQueryTestSuite('query.spaceDelimited', spaceDelimitedTestParsers, spaceDelimitedTestData)
})
