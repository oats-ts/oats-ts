import { fluent, Try } from '@oats-ts/try'
import { HeaderOptions, PrimitiveRecord, HeaderSerializer } from '../types'
import { encode, entries, isNil } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimpleObject =
  <T extends PrimitiveRecord>(options: HeaderOptions<T> = {}): HeaderSerializer<T> =>
  (name: string, data?: T): Try<string> => {
    return fluent(getHeaderValue(name, data, options))
      .map((value) => {
        if (isNil(value)) {
          return undefined
        }
        const kvPairs = entries(value)
          .filter(([, value]) => !isNil(value))
          .map(([key, value]): [string, string] => [encode(key), encode(value)])
        if (options.explode) {
          return kvPairs.map(([key, value]) => `${key}=${value}`).join(',')
        }
        return kvPairs.map(([key, value]) => `${key},${value}`).join(',')
      })
      .getPlain()
  }
