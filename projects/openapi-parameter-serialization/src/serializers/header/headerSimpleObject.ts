import { fluent, Try } from '@oats-ts/try'
import { DslConfig, HeaderParameterSerializer, PrimitiveRecord } from '../../types'
import { encode, entries, isNil } from '../../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimpleObject =
  <T extends PrimitiveRecord>(options: Partial<DslConfig> = {}): HeaderParameterSerializer<T> =>
  (data: T, name: string, path: string): Try<string | undefined> => {
    return fluent(getHeaderValue(path, data, options))
      .map((value) => {
        if (isNil(value)) {
          return undefined
        }
        const kvPairs = entries(value)
          .filter(([, value]) => !isNil(value))
          .map(([key, value]): [string, string] => [encode(key), encode(value?.toString())])
        if (options.explode) {
          return kvPairs.map(([key, value]) => `${key}=${value}`).join(',')
        }
        return kvPairs.map(([key, value]) => `${key},${value}`).join(',')
      })
      .toTry()
  }
