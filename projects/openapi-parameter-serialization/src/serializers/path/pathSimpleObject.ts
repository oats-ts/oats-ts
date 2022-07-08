import { fluent, Try } from '@oats-ts/try'
import { DslConfig, PathParameterSerializer, PrimitiveRecord } from '../../types'
import { entries } from '../../utils'
import { joinKeyValuePairs } from './joinKeyValuePairs'
import { getPathValue, validatePathObject } from './pathUtils'

export const pathSimpleObject =
  <T extends PrimitiveRecord>(options: Partial<DslConfig> = {}): PathParameterSerializer<T> =>
  (data: T, name: string, path: string): Try<string> => {
    return fluent(getPathValue(path, data))
      .flatMap((value) => validatePathObject(path, value))
      .map((value) => joinKeyValuePairs('', options.explode ? '=' : ',', ',', entries(value!)))
      .toTry()
  }
