import { ValueParser, RawPathParams, PathOptions } from '../types'
import { Primitive } from '../types'
import { decode } from '../utils'
import { getPathValue } from './pathUtils'

export const pathSimpleArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T[] => {
    return getPathValue(name, data)
      .split(',')
      .map((value) => parse(name, decode(value)))
  }
