import { fluent, Try } from '@oats-ts/try'
import { Primitive, HeaderOptions, HeaderSerializer } from '../types'
import { encode, isNil } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimplePrimitive =
  <T extends Primitive>(options: HeaderOptions<T> = {}): HeaderSerializer<T> =>
  (name: string, data?: T): Try<string> => {
    // TODO do we need to encode here???
    return fluent(getHeaderValue(name, data, options))
      .map((value) => (isNil(value) ? undefined : encode(value)))
      .getPlain()
  }
