import { ValueParser, RawPathParams, PathOptions, Primitive } from '../types'
import { decode, encode } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

export const pathMatrixPrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T => {
    return parse(name, decode(getPrefixedValue(name, getPathValue(name, data), `;${encode(name)}=`)))
  }
