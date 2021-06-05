import { PrimitiveArray, PathOptions, Primitive } from '../types'
import { encode, getPathValue } from '../utils'
import { joinArrayItems } from './joinArrayItems'
import { joinKeyValuePairs } from './joinKeyValuePairs'

export const pathMatrixArray =
  <T extends PrimitiveArray>(options: PathOptions<T>) =>
  (name: string) =>
  (data: T): string => {
    if (!options.explode) {
      return joinArrayItems(
        `;${encode(name, options.allowReserved)}=`,
        ',',
        getPathValue(name, data, options),
        options.allowReserved,
      )
    }
    return joinKeyValuePairs(
      ';',
      '=',
      ';',
      getPathValue(name, data, options).map((v): [string, Primitive] => [name, v]),
      options.allowReserved,
    )
  }
