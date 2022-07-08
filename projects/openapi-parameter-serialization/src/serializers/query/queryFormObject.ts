import { fluent, Try } from '@oats-ts/try'
import { DslConfig, PrimitiveRecord, QueryParameterSerializer } from '../../types'
import { encode, entries, isNil } from '../../utils'
import { getQueryValue } from './queryUtils'

export const queryFormObject =
  <T extends PrimitiveRecord>(opts: Partial<DslConfig> = {}): QueryParameterSerializer<T> =>
  (data: T, name: string, path: string): Try<string[]> => {
    const options: DslConfig = { required: false, explode: true, ...opts }
    return fluent(getQueryValue(path, data, options))
      .map((value) => {
        if (isNil(value)) {
          return []
        }
        const kvPairs = entries(value).filter(([, value]) => !isNil(value))
        if (options.explode) {
          return kvPairs.map(([key, value]) => `${encode(key)}=${encode(value?.toString())}`)
        }
        const valueStr = kvPairs.map(([key, value]) => [encode(key), encode(value?.toString())].join(',')).join(',')
        return [`${encode(name)}=${valueStr}`]
      })
      .toTry()
  }
