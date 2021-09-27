import { Primitive, ValueParser, QueryOptions, RawQueryParams } from '../types'
import { decode } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryDelimitedArray =
  (delimiter: string) =>
  <T extends Primitive>(parse: ValueParser<string, T>, opts: QueryOptions = {}) =>
  (name: string) =>
  (data: RawQueryParams): T[] => {
    const options: QueryOptions = { explode: true, ...opts }
    const values = options.explode ? data[name] || [] : getQueryValue(name, data, options).split(delimiter)
    return values.map((value) => parse(name, decode(value)))
  }
