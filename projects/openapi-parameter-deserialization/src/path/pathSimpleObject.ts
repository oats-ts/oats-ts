import { flatMap, Try } from '@oats-ts/try'
import { RawPathParams, PathOptions, FieldParsers, PrimitiveRecord, PathValueDeserializer } from '../types'
import { createKeyValuePairRecordParser, createDelimitedRecordParser } from '../utils'
import { getPathValue, parsePathFromRecord } from './pathUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser('path', ',', '=')
const parseDelimitedRecord = createDelimitedRecordParser('path', ',')

export const pathSimpleObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}): PathValueDeserializer<T> =>
  (name: string, data: RawPathParams): Try<T> => {
    return flatMap(getPathValue(name, data), (rawDataStr) => {
      const rawRecordTry = options.explode
        ? parseKeyValuePairRecord(name, rawDataStr)
        : parseDelimitedRecord(name, rawDataStr)
      return flatMap(rawRecordTry, (rawRecord) => {
        return parsePathFromRecord(name, parsers, rawRecord)
      })
    })
  }
