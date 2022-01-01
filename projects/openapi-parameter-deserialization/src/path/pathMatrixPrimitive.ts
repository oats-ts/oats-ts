import { fluent, Try } from '@oats-ts/try'
import { ValueParser, RawPathParams, PathOptions, Primitive, PathValueDeserializer } from '../types'
import { decode, encode } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

export const pathMatrixPrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}): PathValueDeserializer<T> =>
  (name: string, data: RawPathParams): Try<T> => {
    return fluent(getPathValue(name, data))
      .flatMap((pathValue) => getPrefixedValue(name, pathValue, `;${encode(name)}=`))
      .flatMap((rawValue) => parse(name, decode(rawValue)))
      .toJson()
  }
