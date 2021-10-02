import { Primitive, ValueParser, HeaderOptions, RawHeaders } from '../types'
import { decode } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimplePrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: HeaderOptions = {}) =>
  (name: string) =>
  (data: RawHeaders): T => {
    return parse(name, decode(getHeaderValue(name, data, options.required)))
  }
