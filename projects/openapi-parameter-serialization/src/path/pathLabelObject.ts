import { PathSerializer } from '..'
import { PrimitiveRecord, PathOptions } from '../types'
import { entries } from '../utils'
import { joinKeyValuePairs } from './joinKeyValuePairs'
import { getPathValue, validatePathObject } from './pathUtils'

export const pathLabelObject =
  <T extends PrimitiveRecord>(options: PathOptions<T>): PathSerializer<T> =>
  (name: string, data?: T): string => {
    const value = validatePathObject(name, getPathValue(name, data, options))
    return joinKeyValuePairs('.', options.explode ? '=' : ',', options.explode ? '.' : ',', entries(value), true)
  }
