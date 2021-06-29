import { Primitive, PathOptions } from '../types'
import { encode } from '../utils'
import { getPathValue, validatePathPrimitive } from './pathUtils'

export const pathSimplePrimitive =
  <T extends Primitive>(options: PathOptions<T>) =>
  (name: string) =>
  (data: T): string => {
    const value = validatePathPrimitive(name, getPathValue(name, data, options))
    return encode(value)
  }