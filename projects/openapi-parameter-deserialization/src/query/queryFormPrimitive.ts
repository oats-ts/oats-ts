import { Try, flatMap, success } from '@oats-ts/try'
import { QueryOptions, Primitive, ValueParser, RawQueryParams } from '../types'
import { decode, isNil } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryFormPrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: QueryOptions = {}) =>
  (name: string) =>
  (data: RawQueryParams): Try<T> => {
    return flatMap(getQueryValue(name, data, options), (value) => {
      return isNil(value) ? success(undefined) : parse(name, decode(value))
    })
  }
