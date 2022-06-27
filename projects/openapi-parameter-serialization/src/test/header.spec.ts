import * as headerTests from './header.testCases'

import { createHeaderDeserializer } from '../createHeaderDeserializer'
import { createHeaderSerializer } from '../createHeaderSerializer'
import { HeaderTestCase } from './types'
import { success } from '@oats-ts/try'
import { RawHeaders } from '../types'

describe('header', () => {
  Object.values(headerTests).forEach((test: HeaderTestCase<any>) => {
    describe(test.name, () => {
      for (const { from, to } of test.serialize) {
        it(`Should serialize ${JSON.stringify(from)} to ${JSON.stringify(to)}`, () => {
          const serialize = createHeaderSerializer(test.dsl)
          expect(serialize(from)).toEqual(success(to))
        })
      }
      for (const { from, to } of test.deserialize) {
        it(`Should deserialize ${JSON.stringify(from)} to ${JSON.stringify(to)}`, () => {
          const deserialize = createHeaderDeserializer(test.dsl)
          expect(deserialize(from!)).toEqual(success(to))
        })
      }
      for (const serializerError of test.serializerErrors) {
        it(`Should fail serializing ${JSON.stringify(serializerError)}`, () => {
          const serialize = createHeaderSerializer(test.dsl)
          expect(serialize(serializerError)).toHaveProperty('issues')
        })
      }
      for (const deserializerError of test.deserializerErrors) {
        it(`Should fail deserializing ${JSON.stringify(deserializerError)}`, () => {
          const deserialize = createHeaderDeserializer(test.dsl)
          expect(deserialize(deserializerError as RawHeaders)).toHaveProperty('issues')
        })
      }
    })
  })
})
