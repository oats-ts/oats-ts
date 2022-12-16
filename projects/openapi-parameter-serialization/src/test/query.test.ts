import * as queryTestCases from './query.testCases'

import { QueryTestCase } from './types'
import { success } from '@oats-ts/try'
import { testCases } from './common'
import { DefaultQuerySerializer } from '../DefaultQuerySerializer'
import { DefaultQueryDeserializer } from '../DefaultQueryDeserializer'
import { QueryDescriptorRule, QueryParameterRule } from '@oats-ts/rules'

describe('query', () => {
  testCases(queryTestCases).forEach((test: QueryTestCase<any>) => {
    describe(test.name, () => {
      for (const { model, serialized } of test.data) {
        it(`Should serialize ${JSON.stringify(model)} to ${JSON.stringify(serialized)}`, () => {
          const serializer = new DefaultQuerySerializer(test.descriptor)
          expect(serializer.serialize(model)).toEqual(success(serialized))
        })
      }
      for (const { model, serialized } of test.data) {
        it(`Should deserialize ${JSON.stringify(serialized)} to ${JSON.stringify(model)}`, () => {
          const deserializer = new DefaultQueryDeserializer(test.descriptor)
          expect(deserializer.deserialize(serialized!)).toEqual(success(model))
        })
      }
      for (const serializerError of test.serializerErrors) {
        it(`Should fail serializing ${JSON.stringify(serializerError)}`, () => {
          const serializer = new DefaultQuerySerializer(test.descriptor)
          expect(serializer.serialize(serializerError)).toHaveProperty('issues')
        })
      }
      for (const deserializerError of test.deserializerErrors) {
        it(`Should fail deserializing ${JSON.stringify(deserializerError)}`, () => {
          const deserializer = new DefaultQueryDeserializer(test.descriptor)
          expect(deserializer.deserialize(deserializerError!)).toHaveProperty('issues')
        })
      }
    })
  })
  describe('Illegal construction', () => {
    const illegalSchemas: QueryDescriptorRule<any>[] = [
      {
        parameters: { foo: { structure: { type: 'foo' }, style: 'form' } as unknown as QueryParameterRule },
        schema: undefined!,
      },
      {
        parameters: { foo: { structure: { type: 'primtive' }, style: 'label' } as unknown as QueryParameterRule },
        schema: undefined!,
      },
      {
        parameters: { foo: { structure: { type: 'primtive' }, style: 'label' } as unknown as QueryParameterRule },
        schema: undefined!,
      },
      {
        parameters: { foo: { structure: { type: 'object' }, style: 'label' } as unknown as QueryParameterRule },
        schema: undefined!,
      },
      {
        parameters: { foo: { structure: { type: 'object' }, style: 'fooo' } as unknown as QueryParameterRule },
        schema: undefined!,
      },
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
