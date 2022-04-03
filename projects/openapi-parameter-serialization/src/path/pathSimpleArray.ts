import { fluent, Try } from '@oats-ts/try'
import { PrimitiveArray, PathOptions, PathSerializer } from '../types'
import { joinArrayItems } from './joinArrayItems'
import { getPathValue, validatePathArray } from './pathUtils'

export const pathSimpleArray =
  <T extends PrimitiveArray>(options: PathOptions<T> = {}): PathSerializer<T> =>
  (data: T, name: string, path: string): Try<string> => {
    return fluent(getPathValue(path, data, options))
      .flatMap((value) => validatePathArray(path, value))
      .map((value) => joinArrayItems('', ',', value))
      .toTry()
  }
