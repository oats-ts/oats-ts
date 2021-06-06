import { Primitive, PathOptions } from '../types'
import { encode, getPathValue } from '../utils'

export const pathSimplePrimitive =
  <T extends Primitive>(options: PathOptions<T>) =>
  (name: string) =>
  (data: T): string => {
    return encode(getPathValue(name, data, options))
  }
