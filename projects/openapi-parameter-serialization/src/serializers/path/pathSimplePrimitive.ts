import { fluent, Try } from '@oats-ts/try'
import { DslConfig, PathParameterSerializer, Primitive } from '../../types'
import { encode } from '../../utils'
import { getPathValue, validatePathPrimitive } from './pathUtils'

export const pathSimplePrimitive =
  <T extends Primitive>(options: Partial<DslConfig> = {}): PathParameterSerializer<T> =>
  (data: T, name: string, path: string): Try<string> => {
    return fluent(getPathValue(path, data))
      .flatMap((value) => validatePathPrimitive(path, value))
      .map((value) => encode(value?.toString()))
      .toTry()
  }
