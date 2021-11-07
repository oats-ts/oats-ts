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
  return value.slice(prefix.length)
}

export function parsePathFromRecord<T extends PrimitiveRecord>(
  name: string,
  parsers: FieldParsers<T>,
  paramData: Record<string, string>,
): T {
  const result: Record<string, Primitive> = {}
  const parserKeys = Object.keys(parsers)
  for (let i = 0; i < parserKeys.length; i += 1) {
    const key = parserKeys[i]
    const parser = parsers[key]
    const value = paramData[key]
    result[decode(key)] = parser(`${name}.${key}`, decode(value))
  }
  return result as T
}
