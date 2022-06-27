import { fluent, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, Primitive, RawPathParams } from '../..//types'
import { ValueParser, PathValueDeserializer } from '../types'
import { decode } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

export const pathLabelPrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: Partial<DslConfig> = {}): PathValueDeserializer<T> =>
  (data: RawPathParams, name: string, path: string, config: ValidatorConfig): Try<T> => {
    return fluent(getPathValue(name, path, data))
      .flatMap((pathValue) => getPrefixedValue(path, pathValue, '.'))
      .flatMap((rawValue) => parse(decode(rawValue), name, path, config))
      .toTry()
  }
