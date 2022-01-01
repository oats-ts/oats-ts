import { fluent, Try } from '@oats-ts/try'
import { RawPathParams, PathOptions, FieldParsers, PrimitiveRecord, PathValueDeserializer } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser, encode } from '../utils'
import { getPathValue, getPrefixedValue, parsePathFromRecord } from './pathUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser('path', ';', '=')
const parseDelimitedRecord = createDelimitedRecordParser('path', ',')

export const pathMatrixObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}): PathValueDeserializer<T> =>
  (name: string, data: RawPathParams): Try<T> => {
    return fluent(getPathValue(name, data))
      .flatMap((pathValue) =>
        options.explode
          ? getPrefixedValue(name, pathValue, `;`)
          : getPrefixedValue(name, pathValue, `;${encode(name)}=`),
      )
      .flatMap((rawValue) =>
        options.explode ? parseKeyValuePairRecord(name, rawValue) : parseDelimitedRecord(name, rawValue),
      )
      .flatMap((rawRecord) => parsePathFromRecord(name, parsers, rawRecord))
      .toJson()
  }
