import { HeaderSerializer } from '..'
import { PrimitiveArray, HeaderOptions } from '../types'
import { encode, isNil } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimpleArray =
  <T extends PrimitiveArray>(options: HeaderOptions<T>): HeaderSerializer<T> =>
  (name: string, data?: T) => {
    const value = getHeaderValue(name, data, options)
    if (isNil(value)) {
      return undefined
    }
    // TODO do we need to encode here???
    return value
      .filter((item) => !isNil(item))
      .map((item) => encode(item))
      .join(',')
  }
