import { fluent, Try } from '@oats-ts/try'
import { ValueParser, RawPathParams, PathOptions, Primitive, PathValueDeserializer } from '../types'
import { createArrayParser } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

const nonExplodeArrayParser = createArrayParser(',')
const explodeArrayParser = createArrayParser('.')

export const pathLabelArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}): PathValueDeserializer<T[]> =>
  (name: string, data: RawPathParams): Try<T[]> => {
    const arrayParser = options.explode ? explodeArrayParser : nonExplodeArrayParser
    return fluent(getPathValue(name, data))
      .flatMap((pathValue) => getPrefixedValue(name, pathValue, '.'))
      .flatMap((value) => arrayParser(name, value, parse))
      .toJson()
  }
