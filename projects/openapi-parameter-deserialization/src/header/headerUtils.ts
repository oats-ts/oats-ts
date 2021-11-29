import { RawHeaders, PrimitiveRecord, FieldParsers, Primitive } from '../types'
import { isNil, decode } from '../utils'

export function getHeaderValue(name: string, raw: RawHeaders, required: boolean) {
  const value = raw[name] ?? raw[name.toLowerCase()]
  if (isNil(value) && required) {
    throw new TypeError(`Header parameter "${name}" cannot be ${value}`)
  }
  return value
}

export function parseHeadersFromRecord<T extends PrimitiveRecord>(
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
