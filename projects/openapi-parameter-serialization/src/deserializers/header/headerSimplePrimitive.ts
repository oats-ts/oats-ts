import { fluent, success, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, HeaderParameterDeserializer, Primitive, RawHeaders, ValueDeserializer } from '../../types'
import { decode, isNil } from '../../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimplePrimitive =
  <T extends Primitive>(
    parse: ValueDeserializer<string, T>,
    options: Partial<DslConfig> = {},
  ): HeaderParameterDeserializer<T> =>
  (data: RawHeaders, name: string, path: string, config: ValidatorConfig): Try<T> => {
    return fluent(getHeaderValue(name, path, data, options.required))
      .flatMap((value) => (isNil(value) ? success(undefined!) : parse(decode(value), name, path, config)))
      .toTry()
  }
