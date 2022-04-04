import { fluent, Try } from '@oats-ts/try'
import { PrimitiveArray, PathOptions, PathSerializer } from '../types'
import { joinArrayItems } from './joinArrayItems'
import { getPathValue, validatePathArray } from './pathUtils'

export const pathLabelArray =
  <T extends PrimitiveArray>(options: PathOptions = {}): PathSerializer<T> =>
  (data: T, name: string, path: string): Try<string> => {
    return fluent(getPathValue(path, data, options))
      .flatMap((pathValue) => validatePathArray(path, pathValue!))
      .map((value): string => joinArrayItems('.', options.explode ? '.' : ',', value!))
      .toTry()
  }
