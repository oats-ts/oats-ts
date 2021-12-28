import { parsers } from './form.testparsers'
import { testdata } from './form.testdata'
import { createTestSuite } from './query.testutils'

createTestSuite('query.form', parsers, testdata)
