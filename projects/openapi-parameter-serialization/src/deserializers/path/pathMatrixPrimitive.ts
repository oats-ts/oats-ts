import { fluent, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, PathParameterDeserializer, Primitive, RawPathParams, ValueDeserializer } from '../../types'
import { decode, encode } from '../../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

export const pathMatrixPrimitive =
  <T extends Primitive>(
    parse: ValueDeserializer<string, T>,
    options: Partial<DslConfig> = {},
  ): PathParameterDeserializer<T> =>
  (data: RawPathParams, name: string, path: string, config: ValidatorConfig): Try<T> => {
    return fluent(getPathValue(name, path, data))
      .flatMap((pathValue) => getPrefixedValue(path, pathValue, `;${encode(name)}=`))
      .flatMap((rawValue) => parse(decode(rawValue), name, path, config))
      .toTry()
  }
