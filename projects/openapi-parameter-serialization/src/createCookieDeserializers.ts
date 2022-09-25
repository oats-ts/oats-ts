import { entries } from './utils'
import { Transform, DslConfig, CookieDslRoot, CookieParameterType } from './types'
import { unexpectedStyle, unexpectedType } from './errors'

import { cookieFormPrimitive } from './deserializers/cookie/cookieFormPrimitive'
import { createValueDeserializer } from './createValueDeserializer'

export function createCookieDeserializers<T extends CookieParameterType>(root: CookieDslRoot<T>) {
  return entries(root).reduce((obj: Record<string, Transform<any, string | undefined>>, [key, dsl]) => {
    const options: DslConfig = { explode: dsl.explode, required: dsl.required }
    const { style, type } = dsl
    switch (dsl.style) {
      case 'form': {
        switch (dsl.type) {
          case 'primitive': {
            obj[key] = cookieFormPrimitive(createValueDeserializer(dsl.value), options)
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
