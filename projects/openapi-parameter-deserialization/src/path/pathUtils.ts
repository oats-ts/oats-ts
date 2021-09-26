import { FieldParsers, Primitive, PrimitiveRecord, RawPathParams } from '../types'
import { has, isNil, decode } from '../utils'

export function getPathValue(name: string, raw: RawPathParams): string {
  const value = raw[name]
  if (isNil(value)) {
    throw new TypeError(`Path parameter "${name}" cannot be ${value}`)
  }
  return value
}

export function getPrefixedValue(name: string, value: string, prefix: string): string {
  if (value.indexOf(prefix) !== 0) {
    throw new TypeError(`Path parameter "${name}" should start with a "${prefix}"`)
  }
  return value.slice(1)
}

export function parseFromRecord<T extends PrimitiveRecord>(
  name: string,
  parsers: FieldParsers<T>,
  paramData: Record<string, string>,
): T {
  const result: Record<string, Primitive> = {}
  const parserKeys = Object.keys(parsers)
  for (let i = 0; i < parserKeys.length; i += 1) {
    const key = parserKeys[i]
    const parser = parsers[key]
    if (!has(paramData, key)) {
      throw new TypeError(`Missing field "${key}" in path parameter "${name}"`)
    }
    const value = paramData[key]
    result[decode(key)] = parser(key, decode(value))
  }
  return result as T
}

export function parseSeparatedRecord(name: string, value: string, separator: string): Record<string, string> {
  const parts = value.split(separator)
  if (parts.length % 2 !== 0) {
    throw new TypeError(`Malformed value "${value}" for path parameter "${name}"`)
  }
  const record: Record<string, string> = {}
  for (let i = 0; i < parts.length; i += 2) {
    const key = parts[i]
    const value = parts[i + 1]
    record[key] = value
  }
  return record
}

export function parseKeyValuePairRecord(
  name: string,
  value: string,
  separator: string,
  kvSeparator: string,
): Record<string, string> {
  const kvPairStrs = value.split(separator)
  const record: Record<string, string> = {}
  for (let i = 0; i < kvPairStrs.length; i += 1) {
    const kvPairStr = kvPairStrs[i]
    const pair = kvPairStr.split(kvSeparator)
    if (pair.length !== 2) {
      throw new TypeError(`Unexpected content "${value}" in path parameter "${name}"`)
    }
    const [rawKey, rawValue] = pair
    record[rawKey] = rawValue
  }
  return record
}
