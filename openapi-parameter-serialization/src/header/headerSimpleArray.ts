import { PrimitiveArray, HeaderOptions } from '../types'
import { encode, isNil } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimpleArray =
  <T extends PrimitiveArray>(options: HeaderOptions<T>) =>
  (name: string) =>
  (data: T) => {
    const value = getHeaderValue(name, data, options)
    if (isNil(value)) {
      return undefined
    }
    // TODO do we need to encode here???
    return value.map((item) => encode(item)).join(',')
  }
