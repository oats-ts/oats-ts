import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes, ValidatorConfig } from '@oats-ts/validators'
import { FieldValueDeserializers, ParameterValue, PrimitiveRecord, RawHeaders } from '../../types'
import { decode, isNil } from '../../utils'
import { mapRecord } from '../utils'

export function getHeaderValue(name: string, path: string, raw: RawHeaders, required?: boolean): Try<string> {
  const value = raw[name] ?? raw[name.toLowerCase()]
  if (isNil(value) && required) {
    return failure([
      {
        message: `should not be ${value}`,
        path,
        severity: 'error',
        type: IssueTypes.value,
      },
    ])
  }
  return success(value)
}

export function parseHeadersFromRecord<T extends PrimitiveRecord>(
  parsers: FieldValueDeserializers<T>,
  paramData: Record<string, string>,
  name: string,
  path: string,
  config: ValidatorConfig,
): Try<T> {
  const parserKeys = Object.keys(parsers)
  const result = mapRecord(
    parserKeys,
    (key): Try<ParameterValue> => {
      const parser = parsers[key as keyof T]
      const value = paramData[key]
      return parser(decode(value), name, config.append(path, key), config)
    },
    (key) => decode(key),
  )
  return result as Try<T>
}
