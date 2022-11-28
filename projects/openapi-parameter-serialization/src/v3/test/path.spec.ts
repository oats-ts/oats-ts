import * as pathTestCases from './path.testCases'

import { PathTestCase } from './types'
import { success } from '@oats-ts/try'
import { testCases } from './common'
import { DefaultPathSerializer } from '../DefaultPathSerializer'
import { DefaultPathDeserializer } from '../DefaultPathDeserializer'
import { DslType, PathDsl, PathDslRoot, PathStyle } from '../types'

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

  describe('Illegal construction', () => {
    const illegalSchemas: PathDslRoot<any>[] = [
      { schema: { foo: { type: 'foo' as DslType, style: 'label' } as PathDsl }, pathSegments: [], matcher: undefined! },
      {
        schema: { foo: { type: 'foo' as DslType, style: 'matrix' } as PathDsl },
        pathSegments: [],
        matcher: undefined!,
      },
      {
        schema: { foo: { type: 'foo' as DslType, style: 'simple' } as PathDsl },
        pathSegments: [],
        matcher: undefined!,
      },
      {
        schema: { foo: { type: 'object', style: 'fooo' as PathStyle } as PathDsl },
        pathSegments: [],
        matcher: undefined!,
      },
    ]

    illegalSchemas.forEach((schema) => {
      it(`Should throw when trying to serialize with ${JSON.stringify(schema)}`, () => {
        expect(() => new DefaultPathSerializer(schema).serialize({})).toThrowError()
      })
      it(`Should throw when trying to deserialize with ${JSON.stringify(schema)}`, () => {
        expect(() => new DefaultPathDeserializer(schema).deserialize('')).toThrowError()
      })
    })
  })
})
