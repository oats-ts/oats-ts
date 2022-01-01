import { fluent, Try } from '@oats-ts/try'
import { QueryOptions, PrimitiveArray, QuerySerializer } from '../types'
import { encode, isNil } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryDelimitedArray =
  (delimiter: string) =>
  <T extends PrimitiveArray>(opts: QueryOptions<T> = {}): QuerySerializer<T> =>
  (name: string, data?: T): Try<string[]> => {
    const options: QueryOptions<T> = { explode: true, ...opts }
    return fluent(getQueryValue(name, data, options))
      .map((value) => {
        if (isNil(value)) {
          return []
        }
        const keyStr = encode(name)
        if (options.explode) {
          return value.length === 0 ? [] : value.map((item) => `${keyStr}=${encode(item)}`)
        }
        return [`${keyStr}=${value.map((item) => encode(item)).join(delimiter)}`]
      })
      .getPlain()
  }
