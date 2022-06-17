import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes, ValidatorConfig } from '@oats-ts/validators'
import { FieldParsers, Primitive, PrimitiveRecord, RawPathParams } from '../types'
import { isNil, decode, mapRecord } from '../utils'

export function getPathValue(name: string, path: string, raw: RawPathParams): Try<string> {
  const value = raw[name]
  if (isNil(value)) {
    return failure([
      {
        message: `should not be ${value}`,
        path,
        severity: 'error',
        type: IssueTypes.value,
      },
    ])
  }
  return success(value)
}

export function getPrefixedValue(path: string, value: string, prefix: string): Try<string> {
  if (value.indexOf(prefix) !== 0) {
    return failure([
      {
        message: `should start with "${prefix}"`,
        path,
        severity: 'error',
        type: IssueTypes.value,
      },
    ])
  }
  return success(value.slice(prefix.length))
}

export function parsePathFromRecord<T extends PrimitiveRecord>(
  parsers: FieldParsers<T>,
  paramData: Record<string, string>,
  name: string,
  path: string,
  config: ValidatorConfig,
): Try<T> {
  const parserKeys = Object.keys(parsers)
  const result = mapRecord(
    parserKeys,
    (key): Try<Primitive> => {
      const parser = parsers[key]
      const value = paramData[key]
      return parser(decode(value), name, config.append(path, key), config)
    },
    (key) => decode(key),
  )
  return result as Try<T>
}
