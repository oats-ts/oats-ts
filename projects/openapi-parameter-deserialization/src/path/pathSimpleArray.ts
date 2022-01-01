import { fluent, Try } from '@oats-ts/try'
import { ValueParser, RawPathParams, PathOptions, Primitive, PathValueDeserializer } from '../types'
import { createArrayParser } from '../utils'
import { getPathValue } from './pathUtils'

const arrayParser = createArrayParser(',')

export const pathSimpleArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}): PathValueDeserializer<T[]> =>
  (name: string, data: RawPathParams): Try<T[]> => {
    return fluent(getPathValue(name, data))
      .flatMap((pathValue) => arrayParser(name, pathValue, parse))
      .toJson()
  }
