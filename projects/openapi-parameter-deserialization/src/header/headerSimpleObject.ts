import { flatMap, success, Try } from '@oats-ts/try'
import { PrimitiveRecord, FieldParsers, HeaderOptions, RawHeaders } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser, isNil } from '../utils'
import { getHeaderValue, parseHeadersFromRecord } from './headerUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser('path', ',', '=')
const parseDelimitedRecord = createDelimitedRecordParser('path', ',')

export const headerSimpleObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: HeaderOptions = {}) =>
  (name: string, data: RawHeaders): Try<T> => {
    const rawDataStrTry = getHeaderValue(name, data, options.required)
    return flatMap(rawDataStrTry, (rawDataStr) => {
      if (isNil(rawDataStr)) {
        return success(undefined)
      }
      const rawRecordTry = options.explode
        ? parseKeyValuePairRecord(name, rawDataStr)
        : parseDelimitedRecord(name, rawDataStr)
      return flatMap(rawRecordTry, (rawRecord) => parseHeadersFromRecord(name, parsers, rawRecord))
    })
  }
