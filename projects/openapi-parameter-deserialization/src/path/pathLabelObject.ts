import { RawPathParams, PathOptions, FieldParsers, PrimitiveRecord } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser } from '../utils'
import { getPathValue, getPrefixedValue, parsePathFromRecord } from './pathUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser('path', '.', '=')
const parseDelimitedRecord = createDelimitedRecordParser('path', ',')

export const pathLabelObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T => {
    const rawDataStr = getPrefixedValue(name, getPathValue(name, data), '.')
    const rawRecord = options.explode
      ? parseKeyValuePairRecord(name, rawDataStr)
      : parseDelimitedRecord(name, rawDataStr)
    return parsePathFromRecord(name, parsers, rawRecord)
  }
