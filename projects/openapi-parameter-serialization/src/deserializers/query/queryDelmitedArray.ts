import { Try, success, fluent, fromArray } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, Primitive, RawQueryParams } from '../..//types'
import { ValueParser } from '../types'
import { decode, isNil } from '../utils'
import { getQueryValue } from './queryUtils'

function getValues(delimiter: string, options: DslConfig, name: string, path: string, data: RawQueryParams) {
  if (options.explode) {
    return fluent(success(data[name] ?? undefined))
  }
  return fluent(getQueryValue(name, path, data, options)).flatMap((value) =>
    success(isNil(value) ? undefined : value.split(delimiter)),
  )
}

export const queryDelimitedArray =
  (delimiter: string) =>
  <T extends Primitive>(parse: ValueParser<string, T>, opts: Partial<DslConfig> = {}) =>
  (data: RawQueryParams, name: string, path: string, config: ValidatorConfig): Try<T[]> => {
    const options: DslConfig = { explode: true, required: false, ...opts }
    return getValues(delimiter, options, name, path, data)
      .flatMap((values) =>
        isNil(values)
          ? success(undefined!)
          : fromArray(values.map((value, index) => parse(decode(value), name, config.append(path, index), config))),
      )
      .toTry()
  }
