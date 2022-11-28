import * as queryTestCases from './query.testCases'

import { QueryTestCase } from './types'
import { success } from '@oats-ts/try'
import { testCases } from './common'
import { DefaultQuerySerializer } from '../DefaultQuerySerializer'
import { DefaultQueryDeserializer } from '../DefaultQueryDeserializer'
import { DslType, QueryDsl, QueryDslRoot, QueryStyle } from '../types'

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
  describe('Illegal construction', () => {
    const illegalSchemas: QueryDslRoot<any>[] = [
      { schema: { foo: { type: 'foo' as DslType, style: 'form' } as QueryDsl } },
      { schema: { foo: { type: 'primitive', style: 'deepObject' } as QueryDsl } },
      { schema: { foo: { type: 'primitive', style: 'pipeDelimited' } as QueryDsl } },
      { schema: { foo: { type: 'object', style: 'spaceDelimited' } as QueryDsl } },
      { schema: { foo: { type: 'object', style: 'fooo' as QueryStyle } as QueryDsl } },
    ]

    illegalSchemas.forEach((schema) => {
      it(`Should throw when trying to serialize with ${JSON.stringify(schema)}`, () => {
        expect(() => new DefaultQuerySerializer(schema).serialize({})).toThrowError()
      })
      it(`Should throw when trying to deserialize with ${JSON.stringify(schema)}`, () => {
        expect(() => new DefaultQueryDeserializer(schema).deserialize('')).toThrowError()
      })
    })
  })
})
