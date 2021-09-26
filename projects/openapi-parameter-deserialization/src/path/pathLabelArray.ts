import { ValueParser, RawPathParams, PathOptions } from '../types'
import { Primitive } from '../types'
import { decode } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

export const pathLabelArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T[] => {
    return getPrefixedValue(name, getPathValue(name, data), '.')
      .split(',')
      .map((value) => parse(name, decode(value)))
  }
