import { fluent, Try } from '@oats-ts/try'
import { PrimitiveRecord, PathOptions, PathSerializer } from '../types'
import { encode, entries } from '../utils'
import { joinKeyValuePairs } from './joinKeyValuePairs'
import { getPathValue, validatePathObject } from './pathUtils'

export const pathMatrixObject =
  <T extends PrimitiveRecord>(options: PathOptions<T> = {}): PathSerializer<T> =>
  (name: string, data?: T): Try<string> => {
    return fluent(getPathValue(name, data, options))
      .flatMap((value) => validatePathObject(name, value))
      .map((value) =>
        joinKeyValuePairs(
          options.explode ? ';' : `;${encode(name)}=`,
          options.explode ? '=' : ',',
          options.explode ? ';' : ',',
          entries(value),
        ),
      )
      .getPlain()
  }
