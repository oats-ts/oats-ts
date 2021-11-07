import { QuerySerializer } from '..'
import { QueryOptions, PrimitiveArray } from '../types'
import { encode, isNil } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryDelimitedArray =
  (delimiter: string) =>
  <T extends PrimitiveArray>(opts: QueryOptions<T>): QuerySerializer<T> =>
  (name: string) =>
  (data?: T): string[] => {
    const options: QueryOptions<T> = { explode: true, ...opts }
    const value = getQueryValue(name, data, options)
    if (isNil(value)) {
      return []
    }
    const keyStr = encode(name)
    if (options.explode) {
      if (value.length === 0) {
        return []
      }
      return value.map((item) => `${keyStr}=${encode(item)}`)
    }
    return [`${keyStr}=${value.map((item) => encode(item)).join(delimiter)}`]
  }
