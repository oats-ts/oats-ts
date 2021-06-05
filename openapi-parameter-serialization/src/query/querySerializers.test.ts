import { query } from '..'
import { SerializerCreator } from '../types'

import { TestData } from '../testUtils'

import {
  queryFormPrimitiveTestData,
  queryFormArrayTestData,
  queryFormObjectTestData,
  querySpaceDelimitedArrayTestData,
  queryPipeDelimitedArrayTestData,
  queryDeepObjectObjectTestData,
} from './querySerializers.testdata'

function createQueryTest(name: string, data: TestData, fn: SerializerCreator<any>): void {
  describe(name, () => {
    it.each(data.data)('should be "%s", given options: %s, name %s, value: %s', (expected, options, name, value) => {
      expect(fn(options)(name)(value)).toEqual(expected)
    })
    it.each(data.error)('should throw, given options: %s, name %s, value: %s', (options, name, value) => {
      expect(() => fn(options)(name)(value)).toThrowError()
    })
  })
}

createQueryTest('query.form.primitive', queryFormPrimitiveTestData, query.form.primitive)
createQueryTest('query.form.array', queryFormArrayTestData, query.form.array)
createQueryTest('query.form.object', queryFormObjectTestData, query.form.object)
createQueryTest('query.spaceDelimited.array', querySpaceDelimitedArrayTestData, query.spaceDelimited.array)
createQueryTest('query.pipeDelimited.array', queryPipeDelimitedArrayTestData, query.pipeDelimited.array)
createQueryTest('query.deepObject.object', queryDeepObjectObjectTestData, query.deepObject.object)
