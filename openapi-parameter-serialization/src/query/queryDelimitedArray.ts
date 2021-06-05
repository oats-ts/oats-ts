import { QueryOptions, PrimitiveArray } from '../types'
import { encode, getQueryValue, isNil } from '../utils'

export const queryDelimitedArray =
  (delimiter: string) =>
  <T extends PrimitiveArray>(opts: QueryOptions<T>) =>
  (name: string) =>
  (data: T): string[] => {
    const options: QueryOptions<T> = { explode: true, ...opts }
    const value = getQueryValue(name, data, options)
    if (isNil(value)) {
      return []
    }
    const keyStr = encode(name, options.allowReserved)
    if (options.explode) {
      if (value.length === 0) {
        return []
      }
      return value.map((item) => `${keyStr}=${encode(item, options.allowReserved)}`)
    }
    return [`${keyStr}=${value.map((item) => encode(item, options.allowReserved)).join(delimiter)}`]
  }
