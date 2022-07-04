import { failure, fluent, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import { DslConfig, PrimitiveRecord, QueryParameterSerializer } from '../../types'
import { encode, entries, isNil } from '../../utils'
import { getQueryValue } from './queryUtils'

export const queryDeepObjectObject =
  <T extends PrimitiveRecord>(opts: Partial<DslConfig> = {}): QueryParameterSerializer<T> =>
  (data: T, name: string, path: string): Try<string[]> => {
    const options: DslConfig = { required: false, explode: true, ...opts }
    return fluent(getQueryValue(path, data, options))
      .flatMap((value) => {
        if (!options.explode) {
          return failure([
            {
              message: `can only be serialized with explode=true`,
              path,
              severity: 'error',
              type: IssueTypes.other,
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
            const valueStr = encode(value?.toString())
            return `${nameStr}[${keyStr}]=${valueStr}`
          })

        return success(output)
      })
      .toTry()
  }
