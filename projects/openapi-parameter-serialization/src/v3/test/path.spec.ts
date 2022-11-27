import * as pathTestCases from './path.testCases'

import { PathTestCase } from './types'
import { success } from '@oats-ts/try'
import { testCases } from './common'
import { DefaultPathSerializer } from '../DefaultPathSerializer'
import { DefaultPathDeserializer } from '../DefaultPathDeserializer'

describe('path', () => {
  testCases(pathTestCases).forEach((test: PathTestCase<any>) => {
    describe(test.name, () => {
      for (const { model, serialized } of test.data) {
        it(`Should serialize ${JSON.stringify(model)} to ${JSON.stringify(serialized)}`, () => {
          const serializer = new DefaultPathSerializer(test.dsl)
          expect(serializer.serialize(model)).toEqual(success(serialized))
        })
      }
      for (const { model, serialized } of test.data) {
        it(`Should deserialize ${JSON.stringify(serialized)} to ${JSON.stringify(model)}`, () => {
          const deserializer = new DefaultPathDeserializer(test.dsl)
          expect(deserializer.deserialize(serialized!)).toEqual(success(model))
        })
      }
      for (const serializerError of test.serializerErrors) {
        it(`Should fail serializing ${JSON.stringify(serializerError)}`, () => {
          const serializer = new DefaultPathSerializer(test.dsl)
          expect(serializer.serialize(serializerError)).toHaveProperty('issues')
        })
      }
      for (const deserializerError of test.deserializerErrors) {
        it(`Should fail deserializing ${JSON.stringify(deserializerError)}`, () => {
          const deserializer = new DefaultPathDeserializer(test.dsl)
          expect(deserializer.deserialize(deserializerError!)).toHaveProperty('issues')
        })
      }
    })
  })
})
