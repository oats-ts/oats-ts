import { Try, success, fluent, fromArray } from '@oats-ts/try'
import { Primitive, ValueParser, QueryOptions, RawQueryParams } from '../types'
import { decode, isNil } from '../utils'
import { getQueryValue } from './queryUtils'

function getValues(delimiter: string, options: QueryOptions, name: string, data: RawQueryParams) {
  if (options.explode) {
    return fluent(success(data[name] ?? undefined))
  }
  return fluent(getQueryValue(name, data, options)).flatMap((value) =>
    success(isNil(value) ? undefined : value.split(delimiter)),
  )
}

export const queryDelimitedArray =
  (delimiter: string) =>
  <T extends Primitive>(parse: ValueParser<string, T>, opts: QueryOptions = {}) =>
  (name: string, data: RawQueryParams): Try<T[]> => {
    const options: QueryOptions = { explode: true, ...opts }
    return getValues(delimiter, options, name, data)
      .flatMap((values) =>
        isNil(values) ? success(undefined) : fromArray(values.map((value) => parse(name, decode(value)))),
      )
      .toJson()
  }
