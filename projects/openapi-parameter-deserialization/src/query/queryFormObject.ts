import { QueryOptions, PrimitiveRecord, FieldParsers, Primitive, RawQueryParams } from '../types'
import { decode, has, isNil } from '../utils'

export const queryFormObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, opts: QueryOptions = {}) =>
  (name: string) =>
  (data: RawQueryParams): T => {
    const options: QueryOptions = { explode: true, ...opts }
    const output: Record<string, Primitive> = {}
    const parserKeys = Object.keys(parsers)

    if (options.explode) {
      const keyValuePairs: [string, Primitive][] = []
      for (let i = 0; i < parserKeys.length; i += 1) {
        const key = parserKeys[i]
        const parser = parsers[key]
        const values = data[key] || []
        if (values.length > 1) {
          throw new TypeError(`Expected single value for query parameter "${key}" ("${name}.${key}")`)
        }
        const [value] = values
        if (options.required || !isNil(value)) {
          keyValuePairs.push([key, parser(key, decode(value))])
        }
      }
      for (let i = 0; i < keyValuePairs.length; i += 1) {
        const [key, value] = keyValuePairs[i]
        output[key] = value
      }
      return keyValuePairs.length === 0 ? undefined : (output as T)
    } else {
      const values = data[name] || []
      switch (values.length) {
        case 0: {
          if (options.required) {
            throw new TypeError(`Missing query parameter "${name}"`)
          }
          return undefined
        }
        case 1:
          break
        default:
          throw new TypeError(`Expected single query parameter "${name}"`)
      }
      const [value] = values
      const parts = value.split(',')
      if (parts.length % 2 !== 0) {
        throw new TypeError(`Malformed value "${value}" for query parameter "${name}"`)
      }
      for (let i = 0; i < parts.length; i += 2) {
        const key = decode(parts[i])
        const rawValue = decode(parts[i + 1])
        const parser = parsers[key]
        if (isNil(parser)) {
          throw new TypeError(`Unexpected key "${key}" in query parameter "${name}"`)
        }
        const value = parser(key, rawValue)
        output[key] = value
      }
    }

    return output as T
  }
