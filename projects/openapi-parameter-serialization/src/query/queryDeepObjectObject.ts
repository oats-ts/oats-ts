import { QuerySerializer } from '..'
import { QueryOptions, PrimitiveRecord } from '../types'
import { encode, entries, isNil } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryDeepObjectObject =
  <T extends PrimitiveRecord>(opts: QueryOptions<T>): QuerySerializer<T> =>
  (name: string) =>
  (data?: T): string[] => {
    const options: QueryOptions<T> = { explode: true, ...opts }
    const value = getQueryValue(name, data, options)

    if (!options.explode) {
      throw new TypeError(`"${name}" can only be serialized as with explode=true`)
    }

    if (isNil(value)) {
      return []
    }

    const nameStr = encode(name, options.allowReserved)
    const kvPairs = entries(value)

    return kvPairs.map(([key, value]) => {
      const keyStr = encode(key, options.allowReserved)
      const valueStr = encode(value, options.allowReserved)
      return `${nameStr}[${keyStr}]=${valueStr}`
    })
  }
