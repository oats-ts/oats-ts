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
      for (const { from, to } of test.serialize) {
        it(`Should serialize ${JSON.stringify(from)} to ${JSON.stringify(to)}`, () => {
          const serializer = new DefaultQuerySerializer({ schema: test.dsl })
          expect(serializer.serialize(from)).toEqual(success(to))
        })
      }
      for (const { from, to } of test.deserialize) {
        it(`Should deserialize ${JSON.stringify(from)} to ${JSON.stringify(to)}`, () => {
          const deserializer = new DefaultQueryDeserializer({ schema: test.dsl })
          expect(deserializer.deserialize(from!)).toEqual(success(to))
        })
      }
      for (const serializerError of test.serializerErrors) {
        it(`Should fail serializing ${JSON.stringify(serializerError)}`, () => {
          const serializer = new DefaultQuerySerializer({ schema: test.dsl })
          expect(serializer.serialize(serializerError)).toHaveProperty('issues')
        })
      }
      for (const deserializerError of test.deserializerErrors) {
        it(`Should fail deserializing ${JSON.stringify(deserializerError)}`, () => {
          const deserializer = new DefaultQueryDeserializer({ schema: test.dsl })
          expect(deserializer.deserialize(deserializerError!)).toHaveProperty('issues')
        })
      }
    })
  })
})
