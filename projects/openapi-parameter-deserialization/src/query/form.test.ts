import {
  queryFormBooleanParser,
  queryFormEnumArrayExplodeParser,
  queryFormEnumParser,
  queryFormLiteralParser,
  queryFormNumberArrayExplodeParser,
  queryFormNumberParser,
  queryFormObjectExplodeParser,
  queryFormOptionalObjectExplodeParser,
  queryEnumArrayFieldObjectData,
  queryFormBooleanData,
  queryFormEnumData,
  queryFormLiteralData,
  queryFormNumberData,
  queryFormObjectData,
  queryFormOptionalObjectData,
  queryFormStringData,
  queryNumberArrayFieldObjectData,
  queryFormStringParser,
} from './form.testdata'
import { createQueryParserTest } from './query.testutils'

createQueryParserTest('query.form.primitive (string)', queryFormStringData, queryFormStringParser)
createQueryParserTest('query.form.primitive (number)', queryFormNumberData, queryFormNumberParser)
createQueryParserTest('query.form.primitive (boolean)', queryFormBooleanData, queryFormBooleanParser)
createQueryParserTest('query.form.primitive (literal)', queryFormLiteralData, queryFormLiteralParser)
createQueryParserTest('query.form.primitive (enum)', queryFormEnumData, queryFormEnumParser)
createQueryParserTest('query.form.array (number)', queryNumberArrayFieldObjectData, queryFormNumberArrayExplodeParser)
createQueryParserTest('query.form.array (enum)', queryEnumArrayFieldObjectData, queryFormEnumArrayExplodeParser)
createQueryParserTest('query.form.object', queryFormObjectData, queryFormObjectExplodeParser)
createQueryParserTest(
  'query.form.object (optional fields)',
  queryFormOptionalObjectData,
  queryFormOptionalObjectExplodeParser,
)
