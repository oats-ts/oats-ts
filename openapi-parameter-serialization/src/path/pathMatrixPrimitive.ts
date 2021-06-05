import { Primitive, PathOptions } from '../types'
import { encode, getPathValue } from '../utils'

export const pathMatrixPrimitive =
  <T extends Primitive>(options: PathOptions<T>) =>
  (name: string) =>
  (value: T) => {
    const nameStr = encode(name, options.allowReserved)
    const valueStr = encode(getPathValue(name, value, options), options.allowReserved)
    return `;${nameStr}=${valueStr}`
  }
