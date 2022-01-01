import { fluent, Try } from '@oats-ts/try'
import { Primitive, PathOptions, PathSerializer } from '../types'
import { encode } from '../utils'
import { getPathValue, validatePathPrimitive } from './pathUtils'

export const pathMatrixPrimitive =
  <T extends Primitive>(options: PathOptions<T> = {}): PathSerializer<T> =>
  (name: string, data?: T): Try<string> => {
    return fluent(getPathValue(name, data, options))
      .flatMap((value) => validatePathPrimitive(name, value))
      .map((value) => {
        const nameStr = encode(name)
        const valueStr = encode(value)
        return `;${nameStr}=${valueStr}`
      })
      .getPlain()
  }
