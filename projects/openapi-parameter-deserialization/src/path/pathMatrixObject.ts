import { RawPathParams, PathOptions, FieldParsers, PrimitiveRecord } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser, encode } from '../utils'
import { getPathValue, getPrefixedValue, parsePathFromRecord } from './pathUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser('path', ';', '=')
const parseDelimitedRecord = createDelimitedRecordParser('path', ',')

export const pathMatrixObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T => {
    const rawRecord = options.explode
      ? parseKeyValuePairRecord(name, getPrefixedValue(name, getPathValue(name, data), `;`))
      : parseDelimitedRecord(name, getPrefixedValue(name, getPathValue(name, data), `;${encode(name)}=`))
    return parsePathFromRecord(name, parsers, rawRecord)
  }
