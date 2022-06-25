import { entries } from '../utils'
import { Deserializer, DslConfig, HeaderDslRoot, ParameterType, RawHeaders } from './types'
import { unexpectedStyle, unexpectedType } from './errors'
import { createValueDeserializer } from './createValueDeserializer'
import { createPropertyValueDeserializers } from './createPropertyValueDeserializers'

import { headerSimpleArray } from '../deserializers/header/headerSimpleArray'
import { headerSimpleObject } from '../deserializers/header/headerSimpleObject'
import { headerSimplePrimitive } from '../deserializers/header/headerSimplePrimitive'

export function createHeaderDeserializers<T extends ParameterType>(root: HeaderDslRoot<T>) {
  return entries(root).reduce((obj: Record<string, Deserializer<RawHeaders, any>>, [key, dsl]) => {
    const options: DslConfig = { explode: dsl.explode, required: dsl.required }
    const { style, type } = dsl
    switch (dsl.style) {
      case 'simple': {
        switch (dsl.type) {
          case 'primitive': {
            obj[key] = headerSimplePrimitive(createValueDeserializer(dsl.value), options)
            return obj
          }
          case 'array': {
            obj[key] = headerSimpleArray(createValueDeserializer(dsl.items), options)
            return obj
          }
          case 'object': {
            obj[key] = headerSimpleObject(createPropertyValueDeserializers(dsl.properties), options)
            return obj
          }
          default: {
            throw unexpectedType(type)
          }
        }
      }
      default: {
        throw unexpectedStyle(style, ['simple'])
      }
    }
  }, {})
}
