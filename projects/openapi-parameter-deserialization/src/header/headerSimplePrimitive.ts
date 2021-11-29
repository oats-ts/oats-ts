import { Primitive, ValueParser, HeaderOptions, RawHeaders } from '../types'
import { decode, isNil } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimplePrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: HeaderOptions = {}) =>
  (name: string) =>
  (data: RawHeaders): T => {
    const value = getHeaderValue(name, data, options.required)
    return isNil(value) ? undefined : parse(name, decode(value))
  }
