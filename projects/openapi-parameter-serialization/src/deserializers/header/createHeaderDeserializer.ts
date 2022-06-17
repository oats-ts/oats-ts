import { fromRecord, Try } from '@oats-ts/try'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { HeaderValueDeserializers, RawHeaders, ParameterObject, ParameterValue, HeaderDeserializer } from '../types'

export const createHeaderDeserializer = <T extends ParameterObject>(
  deserializers: HeaderValueDeserializers<T>,
): HeaderDeserializer<T> => {
  return (input: RawHeaders, path: string = 'headers', config: ValidatorConfig = DefaultConfig): Try<T> => {
    const deserialized = Object.keys(deserializers).reduce((acc: Record<string, Try<ParameterValue>>, key: string) => {
      const deserializer = deserializers[key]
      acc[key] = deserializer(input, key, config.append(path, key), config)
      return acc
    }, {})
    return fromRecord(deserialized) as Try<T>
  }
}
