import { path } from '..'
import { PathTestData } from '../testUtils'
import { PathSerializerCreator } from '../types'
import { pathSimplePrimitiveTestData } from './pathSerializers.testdata'

function createQueryTest(name: string, data: PathTestData, fn: PathSerializerCreator<any>): void {
  describe(name, () => {
    it.each(data.data)('should be "%s", given options: %s, name %s, value: %s', (expected, options, name, value) => {
      expect(fn(options)(name)(value)).toEqual(expected)
    })
    it.each(data.error)('should throw, given options: %s, name %s, value: %s', (options, name, value) => {
      expect(() => fn(options)(name)(value)).toThrowError()
    })
  })
}

createQueryTest('path.simple.primitive', pathSimplePrimitiveTestData, path.simple.primitive)
