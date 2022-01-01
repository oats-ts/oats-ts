import { fluent, Try } from '@oats-ts/try'
import { PrimitiveArray, PathOptions, Primitive, PathSerializer } from '../types'
import { encode } from '../utils'
import { joinArrayItems } from './joinArrayItems'
import { joinKeyValuePairs } from './joinKeyValuePairs'
import { getPathValue, validatePathArray } from './pathUtils'

export const pathMatrixArray =
  <T extends PrimitiveArray>(options: PathOptions<T> = {}): PathSerializer<T> =>
  (name: string, data?: T): Try<string> => {
    return fluent(getPathValue(name, data, options))
      .flatMap((value) => validatePathArray(name, value))
      .map((value) => {
        if (!options.explode) {
          return joinArrayItems(`;${encode(name)}=`, ',', value)
        }
        return joinKeyValuePairs(
          ';',
          '=',
          ';',
          value.map((v): [string, Primitive] => [name, v]),
        )
      })
      .getPlain()
  }
