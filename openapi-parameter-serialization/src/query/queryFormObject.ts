import { QueryOptions, PrimitiveRecord } from '../types'
import { entries, getQueryValue, isNil, encode } from '../utils'

export const queryFormObject =
  <T extends PrimitiveRecord>(opts: QueryOptions<T>) =>
  (name: string) =>
  (data: T): string[] => {
    const options: QueryOptions<T> = { explode: true, ...opts }
    const value = getQueryValue(name, data, options)
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
