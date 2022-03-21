import { fluent, Try } from '@oats-ts/try'
import { QueryOptions, PrimitiveRecord, QuerySerializer } from '../types'
import { entries, isNil, encode } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryFormObject =
  <T extends PrimitiveRecord>(opts: QueryOptions<T> = {}): QuerySerializer<T> =>
  (data: T, name: string, path: string): Try<string[]> => {
    const options: QueryOptions<T> = { explode: true, ...opts }
    return fluent(getQueryValue(path, data, options))
      .map((value) => {
        if (isNil(value)) {
          return []
        }
        const kvPairs = entries(value).filter(([, value]) => !isNil(value))
        if (options.explode) {
          return kvPairs.map(([key, value]) => `${encode(key)}=${encode(value)}`)
        }
        const valueStr = kvPairs.map(([key, value]) => [encode(key), encode(value)].join(',')).join(',')
        return [`${encode(name)}=${valueStr}`]
      })
      .toJson()
  }
