import { entries } from './utils'
import { Transform, DslConfig, ParameterType, QueryDslRoot } from './types'
import { unexpectedStyle, unexpectedType } from './errors'

import { queryFormPrimitive } from './serializers/query/queryFormPrimitive'
import { queryFormArray } from './serializers/query/queryFormArray'
import { queryFormObject } from './serializers/query/queryFormObject'
import { queryPipeDelimitedArray } from './serializers/query/queryPipeDelimitedArray'
import { querySpaceDelimitedArray } from './serializers/query/querySpaceDelimitedArray'
import { queryDeepObjectObject } from './serializers/query/queryDeepObjectObject'

export function createQuerySerializers<T extends ParameterType>(root: QueryDslRoot<T>) {
  return entries(root).reduce((obj: Record<string, Transform<any, string[]>>, [key, dsl]) => {
    const options: DslConfig = { explode: dsl.explode, required: dsl.required }
    const { style, type } = dsl
    switch (dsl.style) {
      case 'form': {
        switch (dsl.type) {
          case 'primitive': {
            obj[key] = queryFormPrimitive(options)
            return obj
          }
          case 'array': {
            obj[key] = queryFormArray(options)
            return obj
          }
          case 'object': {
            obj[key] = queryFormObject(options)
            return obj
          }
          default: {
            throw unexpectedType(type)
          }
        }
      }
      case 'pipeDelimited': {
        switch (dsl.type) {
          case 'array': {
            obj[key] = queryPipeDelimitedArray(options)
            return obj
          }
          default: {
            throw unexpectedType(type, ['array'])
          }
        }
      }
      case 'spaceDelimited': {
        switch (dsl.type) {
          case 'array': {
            obj[key] = querySpaceDelimitedArray(options)
            return obj
          }
          default: {
            throw unexpectedType(type, ['array'])
          }
        }
      }
      case 'deepObject': {
        switch (dsl.type) {
          case 'object': {
            obj[key] = queryDeepObjectObject(options)
            return obj
          }
          default: {
            throw unexpectedType(type, ['object'])
          }
        }
      }

      default: {
        throw unexpectedStyle(style, ['form', 'pipeDelimited', 'spaceDelimited', 'deepObject'])
      }
    }
  }, {})
}
