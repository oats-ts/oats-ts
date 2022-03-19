import { failure, success, Try } from '@oats-ts/try'
import { RawHeaders, PrimitiveRecord, FieldParsers, ParameterValue } from '../types'
import { isNil, decode, mapRecord } from '../utils'

export function getHeaderValue(name: string, path: string, raw: RawHeaders, required: boolean): Try<string> {
  const value = raw[name] ?? raw[name.toLowerCase()]
  if (isNil(value) && required) {
    return failure([
      {
        message: `should not be ${value}`,
        path,
        severity: 'error',
        type: '',
      },
    ])
  }
  return success(value)
}

export function parseHeadersFromRecord<T extends PrimitiveRecord>(
  name: string,
  parsers: FieldParsers<T>,
  paramData: Record<string, string>,
): Try<T> {
  const parserKeys = Object.keys(parsers)
  const result = mapRecord(
    parserKeys,
    (key): Try<ParameterValue> => {
      const parser = parsers[key]
      const value = paramData[key]
      return parser(`${name}.${key}`, decode(value))
    },
    (key) => decode(key),
  )
  return result as Try<T>
}
