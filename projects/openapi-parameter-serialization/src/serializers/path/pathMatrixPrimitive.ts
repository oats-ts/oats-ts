import { fluent, Try } from '@oats-ts/try'
import { DslConfig, PathParameterSerializer, Primitive } from '../../types'
import { encode } from '../../utils'
import { getPathValue, validatePathPrimitive } from './pathUtils'

export const pathMatrixPrimitive =
  <T extends Primitive>(options: Partial<DslConfig> = {}): PathParameterSerializer<T> =>
  (data: T, name: string, path: string): Try<string> => {
    return fluent(getPathValue(path, data))
      .flatMap((value) => validatePathPrimitive(path, value))
      .map((value) => {
        const nameStr = encode(name)
        const valueStr = encode(value?.toString())
        return `;${nameStr}=${valueStr}`
      })
      .toTry()
  }
