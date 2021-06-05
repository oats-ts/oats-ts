import { Options, PrimitiveRecord } from '../types'
import { entries, getValue, isNil, encode } from '../utils'

export const queryFormObject =
  <T extends PrimitiveRecord>(opts: Options<T>) =>
  (name: string) =>
  (data: T): string[] => {
    const options: Options<T> = { explode: true, ...opts }
    const value = getValue(name, data, options)
    if (isNil(value)) {
      return []
    }
    const kvPairs = entries(value)
    if (options.explode) {
      return kvPairs.map(
        ([key, value]) => `${encode(key, options.allowReserved)}=${encode(value, options.allowReserved)}`,
      )
    }
    const valueStr = kvPairs
      .map(([key, value]) => [encode(key, options.allowReserved), encode(value, options.allowReserved)].join(','))
      .join(',')

    return [`${encode(name, options.allowReserved)}=${valueStr}`]
  }
