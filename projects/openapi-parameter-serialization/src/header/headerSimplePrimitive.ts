import { fluent, Try } from '@oats-ts/try'
import { Primitive, HeaderOptions, HeaderSerializer } from '../types'
import { encode, isNil } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimplePrimitive =
  <T extends Primitive>(options: HeaderOptions<T> = {}): HeaderSerializer<T> =>
  (data: T, name: string, path: string): Try<string> => {
    return fluent(getHeaderValue(path, data, options))
      .map((value) => (isNil(value) ? undefined : encode(value)))
      .toJson()
  }
