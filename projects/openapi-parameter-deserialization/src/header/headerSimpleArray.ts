import { fluent, Try } from '@oats-ts/try'
import { Primitive, ValueParser, HeaderOptions, RawHeaders } from '../types'
import { createArrayParser } from '../utils'
import { getHeaderValue } from './headerUtils'

const arrayParser = createArrayParser(',')

export const headerSimpleArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: HeaderOptions = {}) =>
  (name: string, data: RawHeaders): Try<T[]> => {
    return fluent(getHeaderValue(name, data, options.required))
      .flatMap((value) => arrayParser(name, value, parse))
      .toJson()
  }
