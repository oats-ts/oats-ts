import { PrimitiveArray, PathOptions } from '../types'
import { getPathValue } from '../utils'
import { joinArrayItems } from './joinArrayItems'

export const pathSimpleArray =
  <T extends PrimitiveArray>(options: PathOptions<T>) =>
  (name: string) =>
  (data: T): string => {
    return joinArrayItems('', ',', getPathValue(name, data, options), options.allowReserved)
  }
