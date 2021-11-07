import { ValueParser, RawPathParams, PathOptions, Primitive } from '../types'
import { createArrayParser } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

const nonExplodeArrayParser = createArrayParser(',')
const explodeArrayParser = createArrayParser('.')

export const pathLabelArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T[] => {
    const arrayParser = options.explode ? explodeArrayParser : nonExplodeArrayParser
    return arrayParser(name, getPrefixedValue(name, getPathValue(name, data), '.'), parse)
  }
