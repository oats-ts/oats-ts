import { query } from '..'
import { createSerializerTest } from '../testUtils'

import {
  queryFormPrimitiveTestData,
  queryFormArrayTestData,
  queryFormObjectTestData,
  querySpaceDelimitedArrayTestData,
  queryPipeDelimitedArrayTestData,
  queryDeepObjectObjectTestData,
} from './querySerializers.testdata'

createSerializerTest('query.form.primitive', queryFormPrimitiveTestData, query.form.primitive)
createSerializerTest('query.form.array', queryFormArrayTestData, query.form.array)
createSerializerTest('query.form.object', queryFormObjectTestData, query.form.object)
createSerializerTest('query.spaceDelimited.array', querySpaceDelimitedArrayTestData, query.spaceDelimited.array)
createSerializerTest('query.pipeDelimited.array', queryPipeDelimitedArrayTestData, query.pipeDelimited.array)
createSerializerTest('query.deepObject.object', queryDeepObjectObjectTestData, query.deepObject.object)
