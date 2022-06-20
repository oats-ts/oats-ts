import { fluent, success, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { Primitive, ValueParser, HeaderOptions, RawHeaders } from '../types'
import { decode, isNil } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimplePrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: HeaderOptions = {}) =>
  (data: RawHeaders, name: string, path: string, config: ValidatorConfig): Try<T> => {
    return fluent(getHeaderValue(name, path, data, options.required))
      .flatMap((value) => (isNil(value) ? success(undefined!) : parse(decode(value), name, path, config)))
      .toTry()
  }
