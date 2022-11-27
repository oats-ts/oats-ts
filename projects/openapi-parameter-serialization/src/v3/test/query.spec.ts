import * as queryTestCases from './query.testCases'

import { QueryTestCase } from './types'
import { success } from '@oats-ts/try'
import { DefaultHeaderSerializer } from '../DefaultHeaderSerializer'
import { DefaultHeaderDeserializer } from '../DefaultHeaderDeserializer'
import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { testCases } from './common'
import { DefaultQuerySerializer } from '../DefaultQuerySerializer'
import { DefaultQueryDeserializer } from '../DefaultQueryDeserializer'

describe('query', () => {
  testCases(queryTestCases).forEach((test: QueryTestCase<any>) => {
    describe(test.name, () => {
      for (const { model, serialized } of test.data) {
        it(`Should serialize ${JSON.stringify(model)} to ${JSON.stringify(serialized)}`, () => {
          const serializer = new DefaultQuerySerializer(test.dsl)
          expect(serializer.serialize(model)).toEqual(success(serialized))
        })
      }
      for (const { model, serialized } of test.data) {
        it(`Should deserialize ${JSON.stringify(serialized)} to ${JSON.stringify(model)}`, () => {
          const deserializer = new DefaultQueryDeserializer(test.dsl)
          expect(deserializer.deserialize(serialized!)).toEqual(success(model))
        })
      }
      for (const serializerError of test.serializerErrors) {
        it(`Should fail serializing ${JSON.stringify(serializerError)}`, () => {
          const serializer = new DefaultQuerySerializer(test.dsl)
          expect(serializer.serialize(serializerError)).toHaveProperty('issues')
        })
      }
      for (const deserializerError of test.deserializerErrors) {
        it(`Should fail deserializing ${JSON.stringify(deserializerError)}`, () => {
          const deserializer = new DefaultQueryDeserializer(test.dsl)
          expect(deserializer.deserialize(deserializerError!)).toHaveProperty('issues')
        })
      }
    })
  })
})
