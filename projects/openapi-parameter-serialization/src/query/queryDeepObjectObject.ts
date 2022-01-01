import { failure, fluent, success, Try } from '@oats-ts/try'
import { QueryOptions, PrimitiveRecord, QuerySerializer } from '../types'
import { encode, entries, isNil } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryDeepObjectObject =
  <T extends PrimitiveRecord>(opts: QueryOptions<T> = {}): QuerySerializer<T> =>
  (name: string, data?: T): Try<string[]> => {
    const options: QueryOptions<T> = { explode: true, ...opts }
    return fluent(getQueryValue(name, data, options))
      .flatMap((value) => {
        if (!options.explode) {
          return failure([
            {
              message: `"${name}" can only be serialized as with explode=true`,
              path: name,
              severity: 'error',
              type: '',
            },
          ])
        }

        if (isNil(value)) {
          return success([])
        }

        const nameStr = encode(name)
        const kvPairs = entries(value)

        const output = kvPairs
          .filter(([, value]) => !isNil(value))
          .map(([key, value]) => {
            const keyStr = encode(key)
            const valueStr = encode(value)
            return `${nameStr}[${keyStr}]=${valueStr}`
          })

        return success(output)
      })
      .getPlain()
  }
