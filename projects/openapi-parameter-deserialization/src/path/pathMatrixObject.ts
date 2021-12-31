import { flatMap, Try } from '@oats-ts/try'
import { RawPathParams, PathOptions, FieldParsers, PrimitiveRecord, PathValueDeserializer } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser, encode } from '../utils'
import { getPathValue, getPrefixedValue, parsePathFromRecord } from './pathUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser('path', ';', '=')
const parseDelimitedRecord = createDelimitedRecordParser('path', ',')

export const pathMatrixObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}): PathValueDeserializer<T> =>
  (name: string, data: RawPathParams): Try<T> => {
    return flatMap(getPathValue(name, data), (pathValue) => {
      const rawValueTry = options.explode
        ? getPrefixedValue(name, pathValue, `;`)
        : getPrefixedValue(name, pathValue, `;${encode(name)}=`)
      return flatMap(rawValueTry, (rawValue) => {
        const rawRecordTry = options.explode
          ? parseKeyValuePairRecord(name, rawValue)
          : parseDelimitedRecord(name, rawValue)
        return flatMap(rawRecordTry, (rawRecord) => parsePathFromRecord(name, parsers, rawRecord))
      })
    })
  }
