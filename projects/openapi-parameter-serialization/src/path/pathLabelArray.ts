import { fluent, Try } from '@oats-ts/try'
import { PrimitiveArray, PathOptions, PathSerializer } from '../types'
import { joinArrayItems } from './joinArrayItems'
import { getPathValue, validatePathArray } from './pathUtils'

export const pathLabelArray =
  <T extends PrimitiveArray>(options: PathOptions<T> = {}): PathSerializer<T> =>
  (name: string, data?: T): Try<string> => {
    return fluent(getPathValue(name, data, options))
      .flatMap((pathValue) => validatePathArray(name, pathValue))
      .map((value) => joinArrayItems('.', options.explode ? '.' : ',', value))
      .toJson()
  }
