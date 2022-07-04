import { fluent, Try } from '@oats-ts/try'
import { DslConfig, PathParameterSerializer, Primitive, PrimitiveArray } from '../../types'
import { encode } from '../../utils'
import { joinArrayItems } from './joinArrayItems'
import { joinKeyValuePairs } from './joinKeyValuePairs'
import { getPathValue, validatePathArray } from './pathUtils'

export const pathMatrixArray =
  <T extends PrimitiveArray>(options: Partial<DslConfig> = {}): PathParameterSerializer<T> =>
  (data: T, name: string, path: string): Try<string> => {
    return fluent(getPathValue(path, data))
      .flatMap((value) => validatePathArray(path, value!))
      .map((value) => {
        if (!options.explode) {
          return joinArrayItems(`;${encode(name)}=`, ',', value!)
        }
        return joinKeyValuePairs(
          ';',
          '=',
          ';',
          value!.map((v): [string, Primitive] => [name, v]),
        )
      })
      .toTry()
  }
