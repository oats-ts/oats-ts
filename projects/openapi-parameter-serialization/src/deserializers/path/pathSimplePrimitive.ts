import { fluent, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, Primitive, RawPathParams } from '../..//types'
import { ValueParser, PathValueDeserializer } from '../types'
import { decode } from '../utils'
import { getPathValue } from './pathUtils'

export const pathSimplePrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: Partial<DslConfig> = {}): PathValueDeserializer<T> =>
  (data: RawPathParams, name: string, path: string, config: ValidatorConfig): Try<T> => {
    return fluent(getPathValue(name, path, data))
      .flatMap((pathValue) => parse(decode(pathValue), name, path, config))
      .toTry()
  }
