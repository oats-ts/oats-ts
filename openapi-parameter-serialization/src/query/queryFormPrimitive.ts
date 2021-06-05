import { Options, Primitive } from '../types'
import { encode, getPrimitiveValue, isNil } from '../utils'

export const queryFormPrimitive =
  <T extends Primitive>(options: Options<T>) =>
  (name: string) =>
  (data: T) => {
    const value = getPrimitiveValue(name, data, options)
    if (isNil(value)) {
      return options.allowEmptyValue ? encode(name, options.allowReserved) : undefined
    }
    return `${encode(name, options.allowReserved)}=${encode(value, options.allowReserved)}`
  }
