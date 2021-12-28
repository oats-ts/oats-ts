import { formTestParsers } from './form.testparsers'
import { formTestData } from './form.testdata'
import { createTestSuite } from './query.testutils'
import { deepObjectTestParsers } from './deepObject.testparsers'
import { deepObjectTestData } from './deepObject.testdata'

createTestSuite('query.form', formTestParsers, formTestData)
createTestSuite('query.deepObject', deepObjectTestParsers, deepObjectTestData)
