import * as cookieTestCases from './cookie.testCases'

import { CookieTestCase } from './types'
import { success } from '@oats-ts/try'
import { testCases } from './common'
import { DefaultCookieSerializer } from '../DefaultCookieSerializer'
import { DefaultCookieDeserializer } from '../DefaultCookieDeserializer'
import { CookieDescriptorRule, CookieParameterRule } from '@oats-ts/rules'

describe('cookie', () => {
  testCases(cookieTestCases).forEach((test: CookieTestCase<any>) => {
    describe(test.name, () => {
      for (const { model, serialized } of test.data) {
        it(`Should serialize ${JSON.stringify(model)} to ${JSON.stringify(serialized)}`, () => {
          const serializer = new DefaultCookieSerializer(test.descriptor)
          expect(serializer.serialize(model)).toEqual(success(serialized))
        })
      }
      for (const { model, serialized } of test.data) {
        it(`Should deserialize ${JSON.stringify(serialized)} to ${JSON.stringify(model)}`, () => {
          const deserializer = new DefaultCookieDeserializer(test.descriptor)
          expect(deserializer.deserialize(serialized!)).toEqual(success(model))
        })
      }
      for (const serializerError of test.serializerErrors) {
        it(`Should fail serializing ${JSON.stringify(serializerError)}`, () => {
          const serializer = new DefaultCookieSerializer(test.descriptor)
          expect(serializer.serialize(serializerError)).toHaveProperty('issues')
        })
      }
      for (const deserializerError of test.deserializerErrors) {
        it(`Should fail deserializing ${JSON.stringify(deserializerError)}`, () => {
          const deserializer = new DefaultCookieDeserializer(test.descriptor)
          expect(deserializer.deserialize(deserializerError!)).toHaveProperty('issues')
        })
      }
    })
  })
  describe('Illegal construction', () => {
    const illegalSchemas: CookieDescriptorRule<any>[] = [
      {
        parameters: { foo: { structure: { type: 'foo' }, style: 'form' } as unknown as CookieParameterRule },
        schema: undefined!,
      },
      {
        parameters: { foo: { structure: { type: 'object' }, style: 'fooo' } as unknown as CookieParameterRule },
        schema: undefined!,
      },
    ]

    illegalSchemas.forEach((schema) => {
      it(`Should throw when trying to serialize with ${JSON.stringify(schema)}`, () => {
        expect(() => new DefaultCookieSerializer(schema).serialize({})).toThrowError()
      })
      it(`Should throw when trying to deserialize with ${JSON.stringify(schema)}`, () => {
        expect(() => new DefaultCookieDeserializer(schema).deserialize('')).toThrowError()
      })
    })
  })
})
