import { RawPathParams, PathOptions, FieldParsers, PrimitiveRecord } from '../types'
import { getPathValue, parseFromRecord, parseKeyValuePairRecord, parseSeparatedRecord } from './pathUtils'

export const pathSimpleObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T => {
    const rawDataStr = getPathValue(name, data)
    const rawRecord = options.explode
      ? parseKeyValuePairRecord(name, rawDataStr, ',', '=')
      : parseSeparatedRecord(name, rawDataStr, ',')
    return parseFromRecord(name, parsers, rawRecord)
  }
