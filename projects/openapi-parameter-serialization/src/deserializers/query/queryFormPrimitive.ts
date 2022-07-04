import { Try, success, fluent } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, Primitive, QueryParameterDeserializer, RawQueryParams, ValueDeserializer } from '../../types'
import { decode, isNil } from '../../utils'
import { getQueryValue } from './queryUtils'

export const queryFormPrimitive =
  <T extends Primitive>(
    parse: ValueDeserializer<string, T>,
    options: Partial<DslConfig> = {},
  ): QueryParameterDeserializer<T> =>
  (data: RawQueryParams, name: string, path: string, config: ValidatorConfig): Try<T> => {
    return fluent(getQueryValue(name, path, data, options))
      .flatMap((value) => (isNil(value) ? success(undefined!) : parse(decode(value), name, path, config)))
      .toTry()
  }
