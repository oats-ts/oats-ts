import { fluent, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, PrimitiveRecord, RawPathParams } from '../..//types'
import { FieldParsers, PathValueDeserializer } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser } from '../utils'
import { getPathValue, getPrefixedValue, parsePathFromRecord } from './pathUtils'

export const pathLabelObject = <T extends PrimitiveRecord>(
  parsers: FieldParsers<T>,
  options: Partial<DslConfig> = {},
): PathValueDeserializer<T> => {
  const parseRecord = options.explode ? createKeyValuePairRecordParser('.', '=') : createDelimitedRecordParser(',')
  return (data: RawPathParams, name: string, path: string, config: ValidatorConfig): Try<T> => {
    return fluent(getPathValue(name, path, data))
      .flatMap((pathValue) => getPrefixedValue(path, pathValue, '.'))
      .flatMap((rawDataStr) => parseRecord(rawDataStr, path))
      .flatMap((rawRecord) => parsePathFromRecord(parsers, rawRecord, name, path, config))
      .toTry()
  }
}
