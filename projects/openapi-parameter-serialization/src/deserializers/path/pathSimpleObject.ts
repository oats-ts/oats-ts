import { fluent, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, PrimitiveRecord, RawPathParams } from '../..//types'
import { FieldParsers, PathValueDeserializer } from '../types'
import { createKeyValuePairRecordParser, createDelimitedRecordParser } from '../utils'
import { getPathValue, parsePathFromRecord } from './pathUtils'

export const pathSimpleObject = <T extends PrimitiveRecord>(
  parsers: FieldParsers<T>,
  options: Partial<DslConfig> = {},
): PathValueDeserializer<T> => {
  const parseRecord = options.explode ? createKeyValuePairRecordParser(',', '=') : createDelimitedRecordParser(',')
  return (data: RawPathParams, name: string, path: string, config: ValidatorConfig): Try<T> => {
    return fluent(getPathValue(name, path, data))
      .flatMap((rawDataStr) => parseRecord(rawDataStr, path))
      .flatMap((rawRecord) => parsePathFromRecord(parsers, rawRecord, name, path, config))
      .toTry()
  }
}
