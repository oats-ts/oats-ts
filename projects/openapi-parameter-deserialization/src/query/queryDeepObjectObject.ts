import { Try, mapRecord, failure, map } from '@oats-ts/try'
import { ParameterValue } from '..'
import { QueryOptions, PrimitiveRecord, FieldParsers, RawQueryParams } from '../types'
import { decode, encode, isNil } from '../utils'

export const queryDeepObjectObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: QueryOptions = {}) =>
  (name: string) =>
  (data: RawQueryParams): Try<T> => {
    const parserKeys = Object.keys(parsers)
    let hasKeys: boolean = false
    const output = mapRecord(parserKeys, (key: string): Try<ParameterValue> => {
      const parser = parsers[key]
      const queryKey = `${encode(name)}[${encode(key)}]`
      const values = data[queryKey] || []
      if (values.length > 1) {
        return failure([
          {
            message: `Expected single value for query parameter "${key}" ("${queryKey}")`,
            path: name,
            severity: 'error',
            type: '',
          },
        ])
      }
      const [rawValue] = values
      return map(parser(key, decode(rawValue)), (parsedValue) => {
        hasKeys = true
        return parsedValue
      })
    })
    return map(output, (o) => (hasKeys ? (o as T) : undefined))
  }
