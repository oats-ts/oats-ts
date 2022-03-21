import { fluent, Try } from '@oats-ts/try'
import { PrimitiveRecord, PathOptions, PathSerializer } from '../types'
import { encode, entries } from '../utils'
import { joinKeyValuePairs } from './joinKeyValuePairs'
import { getPathValue, validatePathObject } from './pathUtils'

export const pathMatrixObject =
  <T extends PrimitiveRecord>(options: PathOptions<T> = {}): PathSerializer<T> =>
  (data: T, name: string, path: string): Try<string> => {
    return fluent(getPathValue(path, data, options))
      .flatMap((value) => validatePathObject(path, value))
      .map((value) =>
        joinKeyValuePairs(
          options.explode ? ';' : `;${encode(name)}=`,
          options.explode ? '=' : ',',
          options.explode ? ';' : ',',
          entries(value),
        ),
      )
      .toJson()
  }
