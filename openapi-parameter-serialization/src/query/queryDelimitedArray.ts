import { Options, PrimitiveArray } from '../types'
import { encode, getValue, isNil } from '../utils'

export const queryDelimitedArray =
  (delimiter: string) =>
  <T extends PrimitiveArray>(opts: Options<T>) =>
  (name: string) =>
  (data: T): string[] => {
    const options: Options<T> = { explode: true, ...opts }
    const value = getValue(name, data, options)
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
