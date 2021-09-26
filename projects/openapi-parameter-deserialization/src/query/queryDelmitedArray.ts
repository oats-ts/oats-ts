import { RawQueryParams } from '..'
import { Primitive, PrimitiveParser, QueryOptions } from '../types'
import { decode } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryDelimitedArray =
  (delimiter: string) =>
  <T extends Primitive>(parse: PrimitiveParser<string, T>, options: QueryOptions = {}) =>
  (name: string) =>
  (data: RawQueryParams): T[] => {
    const values = options.explode ? data[name] || [] : getQueryValue(name, data, options).split(delimiter)
    return values.map((value) => parse(name, decode(value)))
  }
