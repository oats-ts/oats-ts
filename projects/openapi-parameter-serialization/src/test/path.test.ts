import * as pathTestCases from './path.testCases'

import { PathTestCase } from './types'
import { success } from '@oats-ts/try'
import { testCases } from './common'
import { DefaultPathSerializer } from '../DefaultPathSerializer'
import { DefaultPathDeserializer } from '../DefaultPathDeserializer'
import { Type, PathParameterDescriptor, PathParameters, PathStyle } from '../types'
import { pathToRegexp } from 'path-to-regexp'
import { parsePathToSegments } from '../parsePathToSegments'

describe('path', () => {
  testCases(pathTestCases).forEach((test: PathTestCase<any>) => {
    describe(test.name, () => {
      for (const { model, serialized } of test.data) {
        it(`Should serialize ${JSON.stringify(model)} to ${JSON.stringify(serialized)}`, () => {
          const serializer = new DefaultPathSerializer(test.descriptor)
          expect(serializer.serialize(model)).toEqual(success(serialized))
        })
      }
      for (const { model, serialized } of test.data) {
        it(`Should deserialize ${JSON.stringify(serialized)} to ${JSON.stringify(model)}`, () => {
          const deserializer = new DefaultPathDeserializer(test.descriptor)
          expect(deserializer.deserialize(serialized!)).toEqual(success(model))
        })
      }
      for (const serializerError of test.serializerErrors) {
        it(`Should fail serializing ${JSON.stringify(serializerError)}`, () => {
          const serializer = new DefaultPathSerializer(test.descriptor)
          expect(serializer.serialize(serializerError)).toHaveProperty('issues')
        })
      }
      for (const deserializerError of test.deserializerErrors) {
        it(`Should fail deserializing ${JSON.stringify(deserializerError)}`, () => {
          const deserializer = new DefaultPathDeserializer(test.descriptor)
          expect(deserializer.deserialize(deserializerError!)).toHaveProperty('issues')
        })
      }
    })
  })

  describe('Illegal construction', () => {
    const illegalSchemas: PathParameters<any>[] = [
      {
        descriptor: { foo: { type: 'foo' as Type, style: 'label' } as PathParameterDescriptor },
        pathSegments: parsePathToSegments('/foo/{foo}'),
        matcher: pathToRegexp('/foo/:foo'),
      },
      {
        descriptor: { foo: { type: 'foo' as Type, style: 'matrix' } as PathParameterDescriptor },
        pathSegments: parsePathToSegments('/foo/{foo}'),
        matcher: pathToRegexp('/foo/:foo'),
      },
      {
        descriptor: { foo: { type: 'foo' as Type, style: 'simple' } as PathParameterDescriptor },
        pathSegments: parsePathToSegments('/foo/{foo}'),
        matcher: pathToRegexp('/foo/:foo'),
      },
      {
        descriptor: { foo: { type: 'object', style: 'fooo' as PathStyle } as PathParameterDescriptor },
        pathSegments: parsePathToSegments('/foo/{foo}'),
        matcher: pathToRegexp('/foo/:foo'),
      },
    ]

    illegalSchemas.forEach((schema) => {
      it(`Should throw when trying to serialize with ${JSON.stringify(schema)}`, () => {
        expect(() => new DefaultPathSerializer(schema).serialize({})).toThrowError()
      })
      it(`Should throw when trying to deserialize with ${JSON.stringify(schema)}`, () => {
        expect(() => new DefaultPathDeserializer(schema).deserialize('/foo/124')).toThrowError()
      })
    })
  })
})
