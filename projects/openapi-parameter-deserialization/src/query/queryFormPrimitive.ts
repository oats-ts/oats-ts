import { Try, success, fluent } from '@oats-ts/try'
import { QueryOptions, Primitive, ValueParser, RawQueryParams, QueryValueDeserializer } from '../types'
import { decode, isNil } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryFormPrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: QueryOptions = {}): QueryValueDeserializer<T> =>
  (name: string, data: RawQueryParams): Try<T> => {
    return fluent(getQueryValue(name, data, options))
      .flatMap((value) => (isNil(value) ? success(undefined) : parse(name, decode(value))))
      .toJson()
  }
