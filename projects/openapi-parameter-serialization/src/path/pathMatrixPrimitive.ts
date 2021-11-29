import { PathSerializer } from '..'
import { Primitive, PathOptions } from '../types'
import { encode } from '../utils'
import { getPathValue, validatePathPrimitive } from './pathUtils'

export const pathMatrixPrimitive =
  <T extends Primitive>(options: PathOptions<T>): PathSerializer<T> =>
  (name: string) =>
  (data?: T) => {
    const value = validatePathPrimitive(name, getPathValue(name, data, options))
    const nameStr = encode(name)
    const valueStr = encode(value)
    return `;${nameStr}=${valueStr}`
  }
