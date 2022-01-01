import { fluent, Try } from '@oats-ts/try'
import { RawPathParams, PathOptions, FieldParsers, PrimitiveRecord, PathValueDeserializer } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser } from '../utils'
import { getPathValue, getPrefixedValue, parsePathFromRecord } from './pathUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser('path', '.', '=')
const parseDelimitedRecord = createDelimitedRecordParser('path', ',')

export const pathLabelObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}): PathValueDeserializer<T> =>
  (name: string, data: RawPathParams): Try<T> => {
    return fluent(getPathValue(name, data))
      .flatMap((pathValue) => getPrefixedValue(name, pathValue, '.'))
      .flatMap((rawDataStr) =>
        options.explode ? parseKeyValuePairRecord(name, rawDataStr) : parseDelimitedRecord(name, rawDataStr),
      )
      .flatMap((rawRecord) => parsePathFromRecord(name, parsers, rawRecord))
      .toJson()
  }
