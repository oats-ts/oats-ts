import { fluent, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { RawPathParams, PathOptions, FieldParsers, PrimitiveRecord, PathValueDeserializer } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser, encode } from '../utils'
import { getPathValue, getPrefixedValue, parsePathFromRecord } from './pathUtils'

export const pathMatrixObject = <T extends PrimitiveRecord>(
  parsers: FieldParsers<T>,
  options: PathOptions = {},
): PathValueDeserializer<T> => {
  const parseRecord = options.explode ? createKeyValuePairRecordParser(';', '=') : createDelimitedRecordParser(',')
  return (data: RawPathParams, name: string, path: string, config: ValidatorConfig): Try<T> => {
    const prefix = options.explode ? ';' : `;${encode(name)}=`
    return fluent(getPathValue(name, path, data))
      .flatMap((pathValue) => getPrefixedValue(path, pathValue, prefix))
      .flatMap((rawValue) => parseRecord(rawValue, path))
      .flatMap((rawRecord) => parsePathFromRecord(parsers, rawRecord, name, path, config))
      .toJson()
  }
}
