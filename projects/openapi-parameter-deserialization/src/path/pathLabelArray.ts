import { flatMap, Try } from '@oats-ts/try'
import { ValueParser, RawPathParams, PathOptions, Primitive, PathValueDeserializer } from '../types'
import { createArrayParser } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

const nonExplodeArrayParser = createArrayParser(',')
const explodeArrayParser = createArrayParser('.')

export const pathLabelArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}): PathValueDeserializer<T[]> =>
  (name: string, data: RawPathParams): Try<T[]> => {
    const arrayParser = options.explode ? explodeArrayParser : nonExplodeArrayParser
    return flatMap(getPathValue(name, data), (pathValue) => {
      return flatMap(getPrefixedValue(name, pathValue, '.'), (value) => {
        return arrayParser(name, value, parse)
      })
    })
  }
