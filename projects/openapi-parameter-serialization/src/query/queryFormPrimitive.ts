import { QuerySerializer } from '..'
import { QueryOptions, Primitive } from '../types'
import { encode, isNil } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryFormPrimitive =
  <T extends Primitive>(options: QueryOptions<T>): QuerySerializer<T> =>
  (name: string) =>
  (data?: T): string[] => {
    const value = getQueryValue(name, data, options)
    if (isNil(value)) {
      return []
    }
    const keyStr = encode(name, options.allowReserved)
    const valStr = encode(value, options.allowReserved)
    return [`${keyStr}=${valStr}`]
  }
