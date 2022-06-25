import { entries } from '../utils'
import { Transform, DslConfig, HeaderDslRoot, ParameterType, RawHeaders } from './types'
import { unexpectedStyle, unexpectedType } from './errors'

import { headerSimpleArray } from '../serializers/header/headerSimpleArray'
import { headerSimpleObject } from '../serializers/header/headerSimpleObject'
import { headerSimplePrimitive } from '../serializers/header/headerSimplePrimitive'

export function createHeaderSerializers<T extends ParameterType>(root: HeaderDslRoot<T>) {
  return entries(root).reduce((obj: Record<string, Transform<any, string | undefined>>, [key, dsl]) => {
    const options: DslConfig = { explode: dsl.explode, required: dsl.required }
    const { style, type } = dsl
    switch (dsl.style) {
      case 'simple': {
        switch (dsl.type) {
          case 'primitive': {
            obj[key] = headerSimplePrimitive(options)
            return obj
          }
          case 'array': {
            obj[key] = headerSimpleArray(options)
            return obj
          }
          case 'object': {
            obj[key] = headerSimpleObject(options)
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
