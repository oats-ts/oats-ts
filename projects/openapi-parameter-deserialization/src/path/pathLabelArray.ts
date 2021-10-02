import { ValueParser, RawPathParams, PathOptions, Primitive } from '../types'
import { createArrayParser } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

const arrayParser = createArrayParser(',')

export const pathLabelArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T[] => {
    return arrayParser(name, getPrefixedValue(name, getPathValue(name, data), '.'), parse)
  }
