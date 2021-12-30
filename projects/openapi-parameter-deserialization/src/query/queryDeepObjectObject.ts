import { Try, failure, map, success } from '@oats-ts/try'
import {
  QueryOptions,
  PrimitiveRecord,
  FieldParsers,
  RawQueryParams,
  QueryValueDeserializer,
  ParameterValue,
} from '../types'
import { decode, encode, isNil, mapRecord } from '../utils'

export const queryDeepObjectObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: QueryOptions = {}): QueryValueDeserializer<T> =>
  (name: string, data: RawQueryParams): Try<T> => {
    const parserKeys = Object.keys(parsers)
    if (parserKeys.length === 0) {
      return success({} as T)
    }
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
      if (!isNil(rawValue)) {
        hasKeys = true
      }
      return parser(`${name}.${key}`, decode(rawValue))
    })
    return !hasKeys && !options.required ? success(undefined) : output
  }
