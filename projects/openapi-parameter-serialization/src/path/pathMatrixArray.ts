import { PathSerializer } from '..'
import { PrimitiveArray, PathOptions, Primitive } from '../types'
import { encode } from '../utils'
import { joinArrayItems } from './joinArrayItems'
import { joinKeyValuePairs } from './joinKeyValuePairs'
import { getPathValue, validatePathArray } from './pathUtils'

export const pathMatrixArray =
  <T extends PrimitiveArray>(options: PathOptions<T>): PathSerializer<T> =>
  (name: string) =>
  (data?: T): string => {
    const value = validatePathArray(name, getPathValue(name, data, options))
    if (!options.explode) {
      return joinArrayItems(`;${encode(name)}=`, ',', value)
    }
    return joinKeyValuePairs(
      ';',
      '=',
      ';',
      value.map((v): [string, Primitive] => [name, v]),
    )
  }
