import { ValueParser, RawQueryParams } from '..'
import { QueryOptions, Primitive } from '../types'
import { decode, isNil } from '../utils'
import { getQueryValue } from './queryUtils'

export const queryFormPrimitive =
  <T extends Primitive>(parse: ValueParser<string, T>, options: QueryOptions = {}) =>
  (name: string) =>
  (data: RawQueryParams): T => {
    const value = getQueryValue(name, data, options)
    if (isNil(value)) {
      return undefined
    }
    return parse(name, decode(value))
  }
