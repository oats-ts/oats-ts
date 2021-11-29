import { Primitive, ValueParser, RawPathParams, PathOptions } from '../types'
import { decode } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

export const pathLabelPrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T => {
    return parse(name, decode(getPrefixedValue(name, getPathValue(name, data), '.')))
  }
