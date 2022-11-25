import * as headerTests from './header.testCases'

import { HeaderTestCase } from './types'
import { success } from '@oats-ts/try'
import { DefaultHeaderSerializer } from '../DefaultHeaderSerializer'
import { DefaultHeaderDeserializer } from '../DefaultHeaderDeserializer'

describe('header', () => {
  Object.values(headerTests).forEach((test: HeaderTestCase<any>) => {
    describe(test.name, () => {
      for (const { from, to } of test.serialize) {
        it(`Should serialize ${JSON.stringify(from)} to ${JSON.stringify(to)}`, () => {
          const serializer = new DefaultHeaderSerializer({ schema: test.dsl })
          expect(serializer.serialize(from)).toEqual(success(to))
        })
      }
      for (const { from, to } of test.deserialize) {
        it(`Should deserialize ${JSON.stringify(from)} to ${JSON.stringify(to)}`, () => {
          const deserializer = new DefaultHeaderDeserializer({ schema: test.dsl })
          expect(deserializer.deserialize(from)).toEqual(success(to))
        })
      }
      for (const serializerError of test.serializerErrors) {
        it(`Should fail serializing ${JSON.stringify(serializerError)}`, () => {
          const serializer = new DefaultHeaderSerializer({ schema: test.dsl })
          expect(serializer.serialize(serializerError)).toHaveProperty('issues')
        })
      }
      for (const deserializerError of test.deserializerErrors) {
        it(`Should fail deserializing ${JSON.stringify(deserializerError)}`, () => {
          const deserializer = new DefaultHeaderDeserializer({ schema: test.dsl })
          expect(deserializer.deserialize(deserializerError)).toHaveProperty('issues')
        })
      }
    })
  })
})
