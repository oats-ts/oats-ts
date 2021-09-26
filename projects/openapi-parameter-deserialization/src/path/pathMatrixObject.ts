import { RawPathParams, PathOptions, FieldParsers, PrimitiveRecord } from '../types'
import { encode } from '../utils'
import {
  getPathValue,
  getPrefixedValue,
  parseFromRecord,
  parseKeyValuePairRecord,
  parseSeparatedRecord,
} from './pathUtils'

export const pathMatrixObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T => {
    const rawRecord = options.explode
      ? parseKeyValuePairRecord(name, getPrefixedValue(name, getPathValue(name, data), `;`), ';', '=')
      : parseSeparatedRecord(name, getPrefixedValue(name, getPathValue(name, data), `;${encode(name)}=`), ',')
    return parseFromRecord(name, parsers, rawRecord)
  }
