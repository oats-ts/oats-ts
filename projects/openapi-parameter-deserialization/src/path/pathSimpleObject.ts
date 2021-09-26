import { decode } from 'punycode'
import { FieldParsers, Primitive, PrimitiveRecord } from '..'
import { RawPathParams, PathOptions } from '../types'
import { has } from '../utils'
import { getPathValue } from './pathUtils'

function asRecord(name: string, value: string, explode: boolean): Record<string, string> {
  if (explode) {
    return value.split(',').reduce((collector: Record<string, string>, kvPairStr: string): Record<string, string> => {
      const pair = kvPairStr.split('=')
      if (pair.length !== 2) {
        throw new TypeError(`Unexpected content "${value}" in path parameter "${name}"`)
      }
      const [key, rawValue] = pair
      collector[key] = rawValue
      return collector
    }, {})
  }

  const parts = value.split(',')
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

export const pathSimpleObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T => {
    const paramData = asRecord(name, getPathValue(name, data), options.explode)
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
