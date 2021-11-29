import { Primitive, ValueParser, HeaderOptions, RawHeaders } from '../types'
import { createArrayParser } from '../utils'
import { getHeaderValue } from './headerUtils'

const arrayParser = createArrayParser(',')

export const headerSimpleArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: HeaderOptions = {}) =>
  (name: string) =>
  (data: RawHeaders): T[] => {
    return arrayParser(name, getHeaderValue(name, data, options.required), parse)
  }
