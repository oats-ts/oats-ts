import { HeaderDslRoot, ParameterType, ParameterValue, RawHeaders } from './types'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { fromRecord, Try } from '@oats-ts/try'
import { createHeaderDeserializers } from './createHeaderDeserializers'
import { HeaderDeserializer } from '../deserializers/types'

export function createHeaderDeserializer<T extends ParameterType>(root: HeaderDslRoot<T>): HeaderDeserializer<T> {
  const deserializers = createHeaderDeserializers(root)
  return function headerDeserializer(
    input: RawHeaders,
    path: string = 'headers',
    config: ValidatorConfig = DefaultConfig,
  ): Try<T> {
    const deserialized = Object.keys(deserializers).reduce((acc: Record<string, Try<ParameterValue>>, key: string) => {
      const deserializer = deserializers?.[key]
      acc[key] = deserializer(input ?? {}, key, config.append(path, key), config)
      return acc
    }, {})
    return fromRecord(deserialized) as Try<T>
  }
}
