import { fluent, success, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import {
  DslConfig,
  FieldValueDeserializers,
  HeaderParameterDeserializer,
  PrimitiveRecord,
  RawHeaders,
} from '../../types'
import { isNil } from '../../utils'
import { createDelimitedRecordParser, createKeyValuePairRecordParser } from '../utils'
import { getHeaderValue, parseHeadersFromRecord } from './headerUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser(',', '=')
const parseDelimitedRecord = createDelimitedRecordParser(',')

export const headerSimpleObject =
  <T extends PrimitiveRecord>(
    parsers: FieldValueDeserializers<T>,
    options: Partial<DslConfig> = {},
  ): HeaderParameterDeserializer<T> =>
  (data: RawHeaders, name: string, path: string, config: ValidatorConfig): Try<T> => {
    return fluent(getHeaderValue(name, path, data, options.required))
      .flatMap((rawDataStr: string): Try<Record<string, string> | undefined> => {
        if (isNil(rawDataStr)) {
          return success(undefined)
        }
        return options.explode ? parseKeyValuePairRecord(rawDataStr, path) : parseDelimitedRecord(rawDataStr, path)
      })
      .flatMap((rawRecord?: Record<string, string>) =>
        isNil(rawRecord) ? success(undefined) : parseHeadersFromRecord(parsers, rawRecord, name, path, config),
      )
      .toTry() as Try<T>
  }
