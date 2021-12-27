import { flatMap, Try } from '@oats-ts/try'
import { ValueParser, RawPathParams, PathOptions, Primitive } from '../types'
import { decode, encode } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

export const pathMatrixPrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): Try<T> => {
    return flatMap(getPathValue(name, data), (pathValue) => {
      return flatMap(getPrefixedValue(name, pathValue, `;${encode(name)}=`), (rawValue) => {
        return parse(name, decode(rawValue))
      })
    })
  }
