import { fluent, success, Try } from '@oats-ts/try'
import { PrimitiveRecord, FieldParsers, HeaderOptions, RawHeaders } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser, isNil } from '../utils'
import { getHeaderValue, parseHeadersFromRecord } from './headerUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser('path', ',', '=')
const parseDelimitedRecord = createDelimitedRecordParser('path', ',')

export const headerSimpleObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: HeaderOptions = {}) =>
  (name: string, data: RawHeaders): Try<T> => {
    return fluent(getHeaderValue(name, data, options.required))
      .flatMap((rawDataStr) => {
        if (isNil(rawDataStr)) {
          return success(undefined)
        }
        return options.explode ? parseKeyValuePairRecord(name, rawDataStr) : parseDelimitedRecord(name, rawDataStr)
      })
      .flatMap((rawRecord?: Record<string, string>) =>
        isNil(rawRecord) ? success(undefined) : parseHeadersFromRecord(name, parsers, rawRecord),
      )
      .toJson()
  }
