import { failure, mapArray, mapRecord, success, Try } from '@oats-ts/try'
import { FieldParsers, Primitive, PrimitiveRecord, RawPathParams } from '../types'
import { has, isNil, decode } from '../utils'

export function getPathValue(name: string, raw: RawPathParams): Try<string> {
  const value = raw[name]
  if (isNil(value)) {
    return failure([
      {
        message: `Path parameter "${name}" cannot be ${value}`,
        path: name,
        severity: 'error',
        type: '',
      },
    ])
  }
  return success(value)
}

export function getPrefixedValue(name: string, value: string, prefix: string): Try<string> {
  if (value.indexOf(prefix) !== 0) {
    return failure([
      {
        message: `Path parameter "${name}" should start with a "${prefix}"`,
        path: name,
        severity: 'error',
        type: '',
      },
    ])
  }
  return success(value.slice(prefix.length))
}

export function parsePathFromRecord<T extends PrimitiveRecord>(
  name: string,
  parsers: FieldParsers<T>,
  paramData: Record<string, string>,
): Try<T> {
  const parserKeys = Object.keys(parsers)
  const result = mapRecord(
    parserKeys,
    (key): Try<Primitive> => {
      const parser = parsers[key]
      const value = paramData[key]
      return parser(`${name}.${key}`, decode(value))
    },
    (key) => decode(key),
  )
  return result as Try<T>
}
