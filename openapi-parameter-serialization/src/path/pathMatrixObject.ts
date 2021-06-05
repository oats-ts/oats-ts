import { PrimitiveRecord, PathOptions } from '../types'
import { encode, entries, getPathValue } from '../utils'
import { joinKeyValuePairs } from './joinKeyValuePairs'

export const pathMatrixObject =
  <T extends PrimitiveRecord>(options: PathOptions<T>) =>
  (name: string) =>
  (value: T) => {
    return joinKeyValuePairs(
      options.explode ? ';' : `;${encode(name, options.allowReserved)}=`,
      options.explode ? '=' : ',',
      options.explode ? ';' : ',',
      entries(getPathValue(name, value, options)),
      options.allowReserved,
    )
  }
