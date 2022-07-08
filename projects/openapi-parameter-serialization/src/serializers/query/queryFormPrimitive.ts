import { fluent, Try } from '@oats-ts/try'
import { DslConfig, Primitive, QueryParameterSerializer } from '../../types'
import { encode, isNil } from '../../utils'
import { getQueryValue } from './queryUtils'

export const queryFormPrimitive =
  <T extends Primitive>(options: Partial<DslConfig> = {}): QueryParameterSerializer<T> =>
  (data: T, name: string, path: string): Try<string[]> => {
    return fluent(getQueryValue(path, data, options))
      .map((value) => {
        if (isNil(value)) {
          return []
        }
        const keyStr = encode(name)
        const valStr = encode(value?.toString())
        return [`${keyStr}=${valStr}`]
      })
      .toTry()
  }
