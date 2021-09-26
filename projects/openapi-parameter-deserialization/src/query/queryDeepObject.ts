import { QueryOptions, PrimitiveRecord, FieldParsers, Primitive, RawQueryParams } from '../types'
import { decode, encode, isNil } from '../utils'

export const queryDeepObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: QueryOptions = {}) =>
  (name: string) =>
  (data: RawQueryParams): T => {
    const output: Record<string, Primitive> = {}
    const parserKeys = Object.keys(parsers)
    let hasKeys: boolean = false

    for (let i = 0; i < parserKeys.length; i += 1) {
      const key = parserKeys[i]
      const parser = parsers[key]
      const queryKey = `${encode(name)}[${encode(key)}]`
      const values = data[queryKey] || []
      if (values.length > 1) {
        throw new TypeError(`Expected single value for query parameter "${key}" ("${queryKey}")`)
      }
      const [rawValue] = values
      if (options.required || !isNil(rawValue)) {
        const value = parser(key, decode(rawValue))
        output[key] = value
        hasKeys = true
      }
    }

    return hasKeys ? (output as T) : undefined
  }
