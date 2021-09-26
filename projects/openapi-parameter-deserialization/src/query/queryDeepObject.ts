import { ObjectDeserializer, Primitive, RawQueryParams } from '..'
import { QueryOptions, PrimitiveRecord } from '../types'
import { decode, has, isNil } from '../utils'

export const queryDeepObject =
  <T extends PrimitiveRecord>(parsers: ObjectDeserializer<T>, opts: QueryOptions = {}) =>
  (name: string) =>
  (data: RawQueryParams): T => {
    const options: QueryOptions = { explode: true, ...opts }
    const output: Record<string, Primitive> = {}
    const parserKeys = Object.keys(parsers)

    return output as T
  }
