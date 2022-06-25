import { entries } from '../utils'
import { Transform, DslConfig, PathDslRoot } from './types'
import { unexpectedStyle, unexpectedType } from './errors'

import { pathLabelArray } from '../serializers/path/pathLabelArray'
import { pathLabelObject } from '../serializers/path/pathLabelObject'
import { pathLabelPrimitive } from '../serializers/path/pathLabelPrimitive'
import { pathMatrixArray } from '../serializers/path/pathMatrixArray'
import { pathMatrixObject } from '../serializers/path/pathMatrixObject'
import { pathMatrixPrimitive } from '../serializers/path/pathMatrixPrimitive'
import { pathSimpleArray } from '../serializers/path/pathSimpleArray'
import { pathSimpleObject } from '../serializers/path/pathSimpleObject'
import { pathSimplePrimitive } from '../serializers/path/pathSimplePrimitive'

export function createPathSerializers<T>(root: PathDslRoot<T>) {
  return entries(root).reduce((obj: Record<string, Transform<any, string>>, [key, dsl]) => {
    const options: DslConfig = { explode: dsl.explode, required: true }
    const { style, type } = dsl
    switch (dsl.style) {
      case 'simple': {
        switch (dsl.type) {
          case 'primitive': {
            obj[key] = pathSimplePrimitive(options)
            return obj
          }
          case 'array': {
            obj[key] = pathSimpleArray(options)
            return obj
          }
          case 'object': {
            obj[key] = pathSimpleObject(options)
            return obj
          }
          default: {
            throw unexpectedType(type)
          }
        }
      }
      case 'label': {
        switch (dsl.type) {
          case 'primitive': {
            obj[key] = pathLabelPrimitive(options)
            return obj
          }
          case 'array': {
            obj[key] = pathLabelArray(options)
            return obj
          }
          case 'object': {
            obj[key] = pathLabelObject(options)
            return obj
          }
          default: {
            throw unexpectedType(type)
          }
        }
      }
      case 'matrix': {
        switch (dsl.type) {
          case 'primitive': {
            obj[key] = pathMatrixPrimitive(options)
            return obj
          }
          case 'array': {
            obj[key] = pathMatrixArray(options)
            return obj
          }
          case 'object': {
            obj[key] = pathMatrixObject(options)
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
