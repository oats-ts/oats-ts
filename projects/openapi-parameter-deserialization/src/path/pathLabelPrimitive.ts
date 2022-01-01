import { fluent, Try } from '@oats-ts/try'
import { Primitive, ValueParser, RawPathParams, PathOptions, PathValueDeserializer } from '../types'
import { decode } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

export const pathLabelPrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}): PathValueDeserializer<T> =>
  (name: string, data: RawPathParams): Try<T> => {
    return fluent(getPathValue(name, data))
      .flatMap((pathValue) => getPrefixedValue(name, pathValue, '.'))
      .flatMap((rawValue) => parse(name, decode(rawValue)))
      .toJson()
  }
