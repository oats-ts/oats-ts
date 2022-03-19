import { fluent, Try } from '@oats-ts/try'
import { Primitive, PathOptions, PathSerializer } from '../types'
import { encode } from '../utils'
import { getPathValue, validatePathPrimitive } from './pathUtils'

export const pathLabelPrimitive =
  <T extends Primitive>(options: PathOptions<T> = {}): PathSerializer<T> =>
  (data: T, name: string, path: string): Try<string> => {
    return fluent(getPathValue(path, data, options))
      .flatMap((value) => validatePathPrimitive(path, value))
      .map((value) => `.${encode(value)}`)
      .toJson()
  }
