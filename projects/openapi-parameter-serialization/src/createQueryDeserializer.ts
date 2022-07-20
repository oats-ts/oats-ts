import { Try, fluent, fromRecord } from '@oats-ts/try'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { parseRawQuery } from './deserializers/query/parseRawQuery'
import { createQueryDeserializers } from './createQueryDeserializers'
import { ParameterType, ParameterValue, QueryDeserializer, QueryDslRoot } from './types'

export function createQueryDeserializer<T extends ParameterType>(dsl: QueryDslRoot<T>): QueryDeserializer<T> {
  const deserializers = createQueryDeserializers(dsl)
  return function queryDeserializer(
    input: string,
    path: string = 'query',
    config: ValidatorConfig = DefaultConfig,
  ): Try<T> {
    const deserialized = fluent(parseRawQuery(input, path)).flatMap((raw) => {
      const parsed = Object.keys(deserializers).reduce((acc: Record<string, Try<ParameterValue>>, key: string) => {
        const deserializer = deserializers[key]
        acc[key] = deserializer(raw, key, config.append(path, key), config)
        return acc
      }, {})
      return fromRecord(parsed)
    })
    return deserialized.toTry() as Try<T>
  }
}
