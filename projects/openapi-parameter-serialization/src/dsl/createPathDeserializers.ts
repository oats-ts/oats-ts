import { entries } from '../utils'
import { Deserializer, DslConfig, PathDslRoot, RawPathParams } from './types'
import { unexpectedStyle, unexpectedType } from './errors'
import { createValueDeserializer } from './createValueDeserializer'
import { createPropertyValueDeserializers } from './createPropertyValueDeserializers'

import { pathLabelArray } from '../deserializers/path/pathLabelArray'
import { pathLabelObject } from '../deserializers/path/pathLabelObject'
import { pathLabelPrimitive } from '../deserializers/path/pathLabelPrimitive'
import { pathMatrixArray } from '../deserializers/path/pathMatrixArray'
import { pathMatrixObject } from '../deserializers/path/pathMatrixObject'
import { pathMatrixPrimitive } from '../deserializers/path/pathMatrixPrimitive'
import { pathSimpleArray } from '../deserializers/path/pathSimpleArray'
import { pathSimpleObject } from '../deserializers/path/pathSimpleObject'
import { pathSimplePrimitive } from '../deserializers/path/pathSimplePrimitive'

export function createPathDeserializers<T>(root: PathDslRoot<T>) {
  return entries(root).reduce((obj: Record<string, Deserializer<RawPathParams, any>>, [key, dsl]) => {
    const options: DslConfig = { explode: dsl.explode, required: dsl.required }
    const { style, type } = dsl
    switch (style) {
      case 'simple': {
        switch (type) {
          case 'primitive': {
            obj[key] = pathSimplePrimitive(createValueDeserializer(dsl.value), options)
            return obj
          }
          case 'array': {
            obj[key] = pathSimpleArray(createValueDeserializer(dsl.items), options)
            return obj
          }
          case 'object': {
            obj[key] = pathSimpleObject(createPropertyValueDeserializers(dsl.properties), options)
            return obj
          }
          default: {
            throw unexpectedType(type)
          }
        }
      }
      case 'label': {
        switch (type) {
          case 'primitive': {
            obj[key] = pathLabelPrimitive(createValueDeserializer(dsl.value), options)
            return obj
          }
          case 'array': {
            obj[key] = pathLabelArray(createValueDeserializer(dsl.items), options)
            return obj
          }
          case 'object': {
            obj[key] = pathLabelObject(createPropertyValueDeserializers(dsl.properties), options)
            return obj
          }
          default: {
            throw unexpectedType(type)
          }
        }
      }
      case 'matrix': {
        switch (type) {
          case 'primitive': {
            obj[key] = pathMatrixPrimitive(createValueDeserializer(dsl.value), options)
            return obj
          }
          case 'array': {
            obj[key] = pathMatrixArray(createValueDeserializer(dsl.items), options)
            return obj
          }
          case 'object': {
            obj[key] = pathMatrixObject(createPropertyValueDeserializers(dsl.properties), options)
            return obj
          }
          default: {
            throw unexpectedType(type)
          }
        }
      }
      default: {
        throw unexpectedStyle(style, ['simple', 'label', 'matrix'])
      }
    }
  }, {})
}
