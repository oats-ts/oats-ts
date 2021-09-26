import {
  queryFormBooleanData,
  queryFormEnumData,
  queryFormLiteralData,
  queryFormNumberData,
  queryFormObjectData,
  queryFormOptionalObjectData,
  queryFormStringData,
} from './query.testdata'
import { createQueryParserTest } from './query.testutils'

createQueryParserTest('query.form.primitive (string)', queryFormStringData)
createQueryParserTest('query.form.primitive (number)', queryFormNumberData)
createQueryParserTest('query.form.primitive (boolean)', queryFormBooleanData)
createQueryParserTest('query.form.primitive (literal)', queryFormLiteralData)
createQueryParserTest('query.form.primitive (enum)', queryFormEnumData)
createQueryParserTest('query.form.object', queryFormObjectData)
createQueryParserTest('query.form.object (optional fields)', queryFormOptionalObjectData)
