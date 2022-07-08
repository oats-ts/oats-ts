import { fluent, Try } from '@oats-ts/try'
import { DslConfig, PrimitiveArray, PathParameterSerializer } from '../../types'
import { joinArrayItems } from './joinArrayItems'
import { getPathValue, validatePathArray } from './pathUtils'

export const pathLabelArray =
  <T extends PrimitiveArray>(options: Partial<DslConfig> = {}): PathParameterSerializer<T> =>
  (data: T, name: string, path: string): Try<string> => {
    return fluent(getPathValue(path, data))
      .flatMap((pathValue) => validatePathArray(path, pathValue!))
      .map((value): string => joinArrayItems('.', options.explode ? '.' : ',', value!))
      .toTry()
  }
