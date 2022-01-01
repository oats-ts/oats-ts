import { Try, fluent, fromRecord } from '@oats-ts/try'
import { ParameterObject, QueryValueDeserializers, ParameterValue, QueryDeserializer } from '../types'
import { parseRawQuery } from './parseRawQuery'

export const createQueryDeserializer =
  <T extends ParameterObject>(deserializers: QueryValueDeserializers<T>): QueryDeserializer<T> =>
  (input: string): Try<T> => {
    const deserialized = fluent(parseRawQuery(input)).flatMap((raw) => {
      const parsed = Object.keys(deserializers).reduce((acc: Record<string, Try<ParameterValue>>, key: string) => {
        const deserializer = deserializers[key]
        acc[key] = deserializer(key, raw)
        return acc
      }, {})
      return fromRecord(parsed)
    })
    return deserialized as Try<T>
  }
