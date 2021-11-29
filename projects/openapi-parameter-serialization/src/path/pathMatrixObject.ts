import { PathSerializer } from '..'
import { PrimitiveRecord, PathOptions } from '../types'
import { encode, entries } from '../utils'
import { joinKeyValuePairs } from './joinKeyValuePairs'
import { getPathValue, validatePathObject } from './pathUtils'

export const pathMatrixObject =
  <T extends PrimitiveRecord>(options: PathOptions<T>): PathSerializer<T> =>
  (name: string) =>
  (data?: T) => {
    const value = validatePathObject(name, getPathValue(name, data, options))
    return joinKeyValuePairs(
      options.explode ? ';' : `;${encode(name)}=`,
      options.explode ? '=' : ',',
      options.explode ? ';' : ',',
      entries(value),
    )
  }
