import { fluent, Try } from '@oats-ts/try'
import { PrimitiveArray, PathOptions, PathSerializer } from '../types'
import { joinArrayItems } from './joinArrayItems'
import { getPathValue, validatePathArray } from './pathUtils'

export const pathSimpleArray =
  <T extends PrimitiveArray>(options: PathOptions<T> = {}): PathSerializer<T> =>
  (name: string, data?: T): Try<string> => {
    return fluent(getPathValue(name, data, options))
      .flatMap((value) => validatePathArray(name, value))
      .map((value) => joinArrayItems('', ',', value))
      .toJson()
  }
