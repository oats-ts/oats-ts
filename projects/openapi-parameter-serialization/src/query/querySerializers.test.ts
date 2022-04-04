import { query } from '.'
import { createSerializerTest } from '../testUtils'

import {
  queryFormPrimitiveTestData,
  queryFormArrayTestData,
  queryFormObjectTestData,
  querySpaceDelimitedArrayTestData,
  queryPipeDelimitedArrayTestData,
  queryDeepObjectObjectTestData,
} from './querySerializers.testdata'

createSerializerTest('query.form.primitive', queryFormPrimitiveTestData, query.form.primitive as any)
createSerializerTest('query.form.array', queryFormArrayTestData, query.form.array as any)
createSerializerTest('query.form.object', queryFormObjectTestData, query.form.object as any)
createSerializerTest('query.spaceDelimited.array', querySpaceDelimitedArrayTestData, query.spaceDelimited.array as any)
createSerializerTest('query.pipeDelimited.array', queryPipeDelimitedArrayTestData, query.pipeDelimited.array as any)
createSerializerTest('query.deepObject.object', queryDeepObjectObjectTestData, query.deepObject.object as any)
