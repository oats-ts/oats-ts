import { flatMap, Try } from '@oats-ts/try'
import { RawPathParams, PathOptions, FieldParsers, PrimitiveRecord } from '../types'
import { createDelimitedRecordParser, createKeyValuePairRecordParser } from '../utils'
import { getPathValue, getPrefixedValue, parsePathFromRecord } from './pathUtils'

const parseKeyValuePairRecord = createKeyValuePairRecordParser('path', '.', '=')
const parseDelimitedRecord = createDelimitedRecordParser('path', ',')

export const pathLabelObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): Try<T> => {
    const output = flatMap(getPathValue(name, data), (pathValue) => {
      return flatMap(getPrefixedValue(name, pathValue, '.'), (rawDataStr) => {
        const rawRecordTry = options.explode
          ? parseKeyValuePairRecord(name, rawDataStr)
          : parseDelimitedRecord(name, rawDataStr)
        return flatMap(rawRecordTry, (rawRecord) => {
          return parsePathFromRecord(name, parsers, rawRecord)
        })
      })
    })
    return output as Try<T>
  }
