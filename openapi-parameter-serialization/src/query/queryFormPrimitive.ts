import { Options, Primitive } from '../types'
import { encode, getValue, isNil } from '../utils'

export const queryFormPrimitive =
  <T extends Primitive>(options: Options<T>) =>
  (name: string) =>
  (data: T): string[] => {
    const value = getValue(name, data, options)
    if (isNil(value)) {
      return []
    }
    const keyStr = encode(name, options.allowReserved)
    const valStr = encode(value, options.allowReserved)
    return [`${keyStr}=${valStr}`]
  }
