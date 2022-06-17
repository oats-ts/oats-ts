import { Try, fluent, fromRecord } from '@oats-ts/try'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { ParameterObject, QueryValueDeserializers, ParameterValue, QueryDeserializer } from '../types'
import { parseRawQuery } from './parseRawQuery'

export const createQueryDeserializer =
  <T extends ParameterObject>(deserializers: QueryValueDeserializers<T>): QueryDeserializer<T> =>
  (input: string, path: string = 'query', config: ValidatorConfig = DefaultConfig): Try<T> => {
    const deserialized = fluent(parseRawQuery(input, path)).flatMap((raw) => {
      const parsed = Object.keys(deserializers).reduce((acc: Record<string, Try<ParameterValue>>, key: string) => {
        const deserializer = deserializers[key]
        acc[key] = deserializer(raw, key, config.append(path, key), config)
        return acc
      }, {})
      return fromRecord(parsed)
    })
    return deserialized as Try<T>
  }
