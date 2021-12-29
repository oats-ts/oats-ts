import { flatMap, success, Try } from '@oats-ts/try'
import { Primitive, ValueParser, HeaderOptions, RawHeaders } from '../types'
import { decode, isNil } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimplePrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: HeaderOptions = {}) =>
  (name: string, data: RawHeaders): Try<T> => {
    return flatMap(getHeaderValue(name, data, options.required), (value) => {
      return isNil(value) ? success(undefined) : parse(name, decode(value))
    })
  }
