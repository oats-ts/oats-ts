import { PrimitiveRecord, FieldParsers, HeaderOptions, RawHeaders } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser, isNil } from '../utils'
import { getHeaderValue, parseHeadersFromRecord } from './headerUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser('path', ',', '=')
const parseDelimitedRecord = createDelimitedRecordParser('path', ',')

export const headerSimpleObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: HeaderOptions = {}) =>
  (name: string) =>
  (data: RawHeaders): T => {
    const rawDataStr = getHeaderValue(name, data, options.required)
    if (isNil(rawDataStr)) {
      return undefined
    }
    const rawRecord = options.explode
      ? parseKeyValuePairRecord(name, rawDataStr)
      : parseDelimitedRecord(name, rawDataStr)
    return parseHeadersFromRecord(name, parsers, rawRecord)
  }
