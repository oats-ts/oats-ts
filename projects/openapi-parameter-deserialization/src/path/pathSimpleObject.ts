import { RawPathParams, PathOptions, FieldParsers, PrimitiveRecord } from '../types'
import { createKeyValuePairRecordParser, createDelimitedRecordParser } from '../utils'
import { getPathValue, parsePathFromRecord } from './pathUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser('path', ',', '=')
const parseDelimitedRecord = createDelimitedRecordParser('path', ',')

export const pathSimpleObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T => {
    const rawDataStr = getPathValue(name, data)
    const rawRecord = options.explode
      ? parseKeyValuePairRecord(name, rawDataStr)
      : parseDelimitedRecord(name, rawDataStr)
    return parsePathFromRecord(name, parsers, rawRecord)
  }
