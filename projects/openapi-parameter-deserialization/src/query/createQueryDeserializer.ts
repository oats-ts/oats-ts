import { Try, mapRecord } from '@oats-ts/try'
import { ParameterObject, QueryValueDeserializers, ParameterValue, QueryDeserializer } from '../types'
import { parseRawQuery } from './parseRawQuery'

export const createQueryDeserializer =
  <T extends ParameterObject>(deserializers: QueryValueDeserializers<T>): QueryDeserializer<T> =>
  (input: string): Try<T> => {
    const [rawQueryIssues, raw] = parseRawQuery(input)
    if (rawQueryIssues.length > 0) {
      return [rawQueryIssues, undefined]
    }
    const keys = Object.keys(deserializers)
    const output = mapRecord(keys, (key): Try<ParameterValue> => {
      const deserializer = deserializers[key]
      return deserializer(key, raw)
    })
    return output as Try<T>
  }
