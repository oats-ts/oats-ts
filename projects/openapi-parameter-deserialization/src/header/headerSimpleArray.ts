import { flatMap, Try } from '@oats-ts/try'
import { Primitive, ValueParser, HeaderOptions, RawHeaders } from '../types'
import { createArrayParser } from '../utils'
import { getHeaderValue } from './headerUtils'

const arrayParser = createArrayParser(',')

export const headerSimpleArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: HeaderOptions = {}) =>
  (name: string) =>
  (data: RawHeaders): Try<T[]> => {
    return flatMap(getHeaderValue(name, data, options.required), (value) => arrayParser(name, value, parse))
  }
