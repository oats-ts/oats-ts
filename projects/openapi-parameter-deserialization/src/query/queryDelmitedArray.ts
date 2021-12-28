import { Try, flatMap, success, mapArray } from '@oats-ts/try'
import { Primitive, ValueParser, QueryOptions, RawQueryParams } from '../types'
import { decode, isNil } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryDelimitedArray =
  (delimiter: string) =>
  <T extends Primitive>(parse: ValueParser<string, T>, opts: QueryOptions = {}) =>
  (name: string) =>
  (data: RawQueryParams): Try<T[]> => {
    const options: QueryOptions = { explode: true, ...opts }

    const valuesTry = options.explode
      ? success(data[name] ?? [])
      : flatMap(getQueryValue(name, data, options), (v) => success(isNil(v) ? [] : v.split(delimiter)))

    return flatMap(valuesTry, (values) => {
      return mapArray(values, (value) => parse(name, decode(value)))
    })
  }
