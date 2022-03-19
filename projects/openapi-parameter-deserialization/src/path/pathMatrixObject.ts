import { fluent, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { RawPathParams, PathOptions, FieldParsers, PrimitiveRecord, PathValueDeserializer } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser, encode } from '../utils'
import { getPathValue, getPrefixedValue, parsePathFromRecord } from './pathUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser(';', '=')
const parseDelimitedRecord = createDelimitedRecordParser(',')

export const pathMatrixObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}): PathValueDeserializer<T> =>
  (data: RawPathParams, name: string, path: string, config: ValidatorConfig): Try<T> => {
    return fluent(getPathValue(name, path, data))
      .flatMap((pathValue) =>
        options.explode
          ? getPrefixedValue(path, pathValue, `;`)
          : getPrefixedValue(path, pathValue, `;${encode(name)}=`),
      )
      .flatMap((rawValue) =>
        options.explode ? parseKeyValuePairRecord(rawValue, path) : parseDelimitedRecord(rawValue, path),
      )
      .flatMap((rawRecord) => parsePathFromRecord(parsers, rawRecord, name, path, config))
      .toJson()
  }
