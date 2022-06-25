import { entries } from '../utils'
import { Deserializer, DslConfig, ParameterType, QueryDslRoot, RawQueryParams } from './types'
import { unexpectedStyle, unexpectedType } from './errors'
import { createValueDeserializer } from './createValueDeserializer'
import { createPropertyValueDeserializers } from './createPropertyValueDeserializers'

import { queryFormPrimitive } from '../deserializers/query/queryFormPrimitive'
import { queryFormArray } from '../deserializers/query/queryFormArray'
import { queryFormObject } from '../deserializers/query/queryFormObject'
import { queryPipeDelimitedArray } from '../deserializers/query/queryPipeDelimitedArray'
import { querySpaceDelimitedArray } from '../deserializers/query/querySpaceDelimitedArray'
import { queryDeepObjectObject } from '../deserializers/query/queryDeepObjectObject'

export function createQueryDeserializers<T extends ParameterType>(root: QueryDslRoot<T>) {
  return entries(root).reduce((obj: Record<string, Deserializer<RawQueryParams, any>>, [key, dsl]) => {
    const options: DslConfig = { explode: dsl.explode, required: dsl.required }
    const { style, type } = dsl
    switch (style) {
      case 'form': {
        switch (type) {
          case 'primitive': {
            obj[key] = queryFormPrimitive(createValueDeserializer(dsl.value), options)
            return obj
          }
          case 'array': {
            obj[key] = queryFormArray(createValueDeserializer(dsl.items), options)
            return obj
          }
          case 'object': {
            obj[key] = queryFormObject(createPropertyValueDeserializers(dsl.properties), options)
            return obj
          }
          default: {
            throw unexpectedType(type)
          }
        }
      }
      case 'pipeDelimited': {
        switch (type) {
          case 'array': {
            obj[key] = queryPipeDelimitedArray(createValueDeserializer(dsl.items), options)
            return obj
          }
          default: {
            throw unexpectedType(type, ['array'])
          }
        }
      }
      case 'spaceDelimited': {
        switch (type) {
          case 'array': {
            obj[key] = querySpaceDelimitedArray(createValueDeserializer(dsl.items), options)
            return obj
          }
          default: {
            throw unexpectedType(type, ['array'])
          }
        }
      }
      case 'deepObject': {
        switch (type) {
          case 'object': {
            obj[key] = queryDeepObjectObject(createPropertyValueDeserializers(dsl.properties), options)
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
