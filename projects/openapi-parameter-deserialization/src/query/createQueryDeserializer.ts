import { Try, mapRecord, flatMap } from '@oats-ts/try'
import { ParameterObject, QueryValueDeserializers, ParameterValue, QueryDeserializer } from '../types'
import { parseRawQuery } from './parseRawQuery'

export const createQueryDeserializer =
  <T extends ParameterObject>(deserializers: QueryValueDeserializers<T>): QueryDeserializer<T> =>
  (input: string): Try<T> => {
    const rawQueryTry = parseRawQuery(input)
    const keys = Object.keys(deserializers)
    const output = flatMap(rawQueryTry, (raw) => {
      return mapRecord(keys, (key): Try<ParameterValue> => {
        const deserializer = deserializers[key]
        return deserializer(key, raw)
      })
    })
    return output as Try<T>
  }
