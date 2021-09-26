import { FieldParsers, PrimitiveRecord } from '..'
import { RawPathParams, PathOptions } from '../types'
import {
  getPathValue,
  getPrefixedValue,
  parseFromRecord,
  parseKeyValuePairRecord,
  parseSeparatedRecord,
} from './pathUtils'

export const pathLabelObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T => {
    const rawDataStr = getPrefixedValue(name, getPathValue(name, data), '.')
    const rawRecord = options.explode
      ? parseKeyValuePairRecord(name, rawDataStr, '.', '=')
      : parseSeparatedRecord(name, rawDataStr, ',')
    return parseFromRecord(name, parsers, rawRecord)
  }
