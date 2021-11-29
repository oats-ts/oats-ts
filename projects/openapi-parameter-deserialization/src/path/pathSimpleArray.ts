import { ValueParser, RawPathParams, PathOptions, Primitive } from '../types'
import { createArrayParser } from '../utils'
import { getPathValue } from './pathUtils'

const arrayParser = createArrayParser(',')

export const pathSimpleArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T[] => {
    return arrayParser(name, getPathValue(name, data), parse)
  }
