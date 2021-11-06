import { HeaderSerializer } from '..'
import { Primitive, HeaderOptions } from '../types'
import { encode, isNil } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimplePrimitive =
  <T extends Primitive>(options: HeaderOptions<T>): HeaderSerializer<T> =>
  (name: string) =>
  (data?: T): string => {
    const value = getHeaderValue(name, data, options)
    if (isNil(value)) {
      return undefined
    }
    // TODO do we need to encode here???
    return encode(value)
  }
