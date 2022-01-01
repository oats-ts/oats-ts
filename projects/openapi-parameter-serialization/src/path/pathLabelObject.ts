import { fluent, Try } from '@oats-ts/try'
import { PrimitiveRecord, PathOptions, PathSerializer } from '../types'
import { entries } from '../utils'
import { joinKeyValuePairs } from './joinKeyValuePairs'
import { getPathValue, validatePathObject } from './pathUtils'

export const pathLabelObject =
  <T extends PrimitiveRecord>(options: PathOptions<T> = {}): PathSerializer<T> =>
  (name: string, data?: T): Try<string> => {
    return fluent(getPathValue(name, data, options))
      .flatMap((value) => validatePathObject(name, value))
      .map((value) => {
        const kvSeparator = options.explode ? '=' : ','
        const separator = options.explode ? '.' : ','
        return joinKeyValuePairs('.', kvSeparator, separator, entries(value), true)
      })
      .toJson()
  }
