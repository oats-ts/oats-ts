import { fluent, success, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { PrimitiveRecord, FieldParsers, HeaderOptions, RawHeaders } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser, isNil } from '../utils'
import { getHeaderValue, parseHeadersFromRecord } from './headerUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser(',', '=')
const parseDelimitedRecord = createDelimitedRecordParser(',')

export const headerSimpleObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: HeaderOptions = {}) =>
  (data: RawHeaders, name: string, path: string, config: ValidatorConfig): Try<T> => {
    return fluent(getHeaderValue(name, path, data, options.required))
      .flatMap((rawDataStr) => {
        if (isNil(rawDataStr)) {
          return success(undefined)
        }
        return options.explode ? parseKeyValuePairRecord(rawDataStr, path) : parseDelimitedRecord(rawDataStr, path)
      })
      .flatMap((rawRecord?: Record<string, string>) =>
        isNil(rawRecord) ? success(undefined) : parseHeadersFromRecord(parsers, rawRecord, name, path, config),
      )
      .toTry()
  }
