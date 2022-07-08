import { fluent, Try } from '@oats-ts/try'
import { DslConfig, PathParameterSerializer, PrimitiveArray } from '../../types'
import { joinArrayItems } from './joinArrayItems'
import { getPathValue, validatePathArray } from './pathUtils'

export const pathSimpleArray =
  <T extends PrimitiveArray>(options: Partial<DslConfig> = {}): PathParameterSerializer<T> =>
  (data: T, name: string, path: string): Try<string> => {
    return fluent(getPathValue(path, data))
      .flatMap((value) => validatePathArray(path, value ?? []))
      .map((value) => joinArrayItems('', ',', value))
      .toTry()
  }
