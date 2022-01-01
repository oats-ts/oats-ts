import { fluent, success, Try } from '@oats-ts/try'
import { Primitive, ValueParser, HeaderOptions, RawHeaders } from '../types'
import { decode, isNil } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimplePrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: HeaderOptions = {}) =>
  (name: string, data: RawHeaders): Try<T> => {
    return fluent(getHeaderValue(name, data, options.required))
      .flatMap((value) => (isNil(value) ? success(undefined) : parse(name, decode(value))))
      .toJson()
  }
