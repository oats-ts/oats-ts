import { fluent, map, Try } from '@oats-ts/try'
import { QueryOptions, Primitive, QuerySerializer } from '../types'
import { encode, isNil } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryFormPrimitive =
  <T extends Primitive>(options: QueryOptions<T> = {}): QuerySerializer<T> =>
  (name: string, data?: T): Try<string[]> => {
    return fluent(getQueryValue(name, data, options))
      .map((value) => {
        if (isNil(value)) {
          return []
        }
        const keyStr = encode(name)
        const valStr = encode(value)
        return [`${keyStr}=${valStr}`]
      })
      .getPlain()
  }
