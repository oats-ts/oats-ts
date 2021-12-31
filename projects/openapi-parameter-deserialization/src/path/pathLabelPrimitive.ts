import { flatMap, Try } from '@oats-ts/try'
import { Primitive, ValueParser, RawPathParams, PathOptions, PathValueDeserializer } from '../types'
import { decode } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

export const pathLabelPrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}): PathValueDeserializer<T> =>
  (name: string, data: RawPathParams): Try<T> => {
    return flatMap(getPathValue(name, data), (pathValue) => {
      return flatMap(getPrefixedValue(name, pathValue, '.'), (rawValue) => {
        return parse(name, decode(rawValue))
      })
    })
  }
