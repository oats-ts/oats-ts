import * as headerTests from './header.testCases'

import { HeaderTestCase } from './types'
import { success } from '@oats-ts/try'
import { DefaultHeaderSerializer } from '../DefaultHeaderSerializer'
import { DefaultHeaderDeserializer } from '../DefaultHeaderDeserializer'
import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { testCases } from './common'
import { Type, HeaderParameterDescriptor, HeaderParameters, HeaderStyle } from '../types'

describe('header', () => {
  testCases(headerTests).forEach((test: HeaderTestCase<any>) => {
    describe(test.name, () => {
      for (const { model, serialized } of test.data) {
        it(`Should serialize ${JSON.stringify(model)} to ${JSON.stringify(serialized)}`, () => {
          const serializer = new DefaultHeaderSerializer(test.descriptor)
          expect(serializer.serialize(model)).toEqual(success(serialized))
        })
      }
      for (const { model, serialized } of test.data) {
        it(`Should deserialize ${JSON.stringify(serialized)} to ${JSON.stringify(model)}`, () => {
          const deserializer = new DefaultHeaderDeserializer(test.descriptor)
          expect(deserializer.deserialize(serialized as RawHttpHeaders)).toEqual(success(model))
        })
      }
      for (const serializerError of test.serializerErrors) {
        it(`Should fail serializing ${JSON.stringify(serializerError)}`, () => {
          const serializer = new DefaultHeaderSerializer(test.descriptor)
          expect(serializer.serialize(serializerError)).toHaveProperty('issues')
        })
      }
      for (const deserializerError of test.deserializerErrors) {
        it(`Should fail deserializing ${JSON.stringify(deserializerError)}`, () => {
          const deserializer = new DefaultHeaderDeserializer(test.descriptor)
          expect(deserializer.deserialize(deserializerError as RawHttpHeaders)).toHaveProperty('issues')
        })
      }
    })
  })
  describe('Illegal construction', () => {
    const illegalSchemas: HeaderParameters<any>[] = [
      { descriptor: { foo: { type: 'foo' as Type, style: 'simple' } as HeaderParameterDescriptor } },
      { descriptor: { foo: { type: 'primitive', style: 'deepObject' as HeaderStyle } as HeaderParameterDescriptor } },
    ]

    illegalSchemas.forEach((schema) => {
      it(`Should throw when trying to serialize with ${JSON.stringify(schema)}`, () => {
        expect(() => new DefaultHeaderSerializer(schema).serialize({})).toThrowError()
      })
      it(`Should throw when trying to deserialize with ${JSON.stringify(schema)}`, () => {
        expect(() => new DefaultHeaderDeserializer(schema).deserialize({})).toThrowError()
      })
    })
  })
})
