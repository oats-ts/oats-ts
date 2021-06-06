import { PrimitiveArray, PathOptions } from '../types'
import { joinArrayItems } from './joinArrayItems'
import { getPathValue, validatePathArray } from './pathUtils'

export const pathSimpleArray =
  <T extends PrimitiveArray>(options: PathOptions<T>) =>
  (name: string) =>
  (data: T): string => {
    const value = validatePathArray(name, getPathValue(name, data, options))
    return joinArrayItems('', ',', value)
  }
