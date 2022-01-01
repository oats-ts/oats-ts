import { fromRecord, Try } from '@oats-ts/try'
import { HeaderValueDeserializers, RawHeaders, ParameterObject, ParameterValue, HeaderDeserializer } from '../types'

export const createHeaderDeserializer = <T extends ParameterObject>(
  deserializers: HeaderValueDeserializers<T>,
): HeaderDeserializer<T> => {
  return (input: RawHeaders): Try<T> => {
    const deserialized = Object.keys(deserializers).reduce((acc: Record<string, Try<ParameterValue>>, key: string) => {
      const deserializer = deserializers[key]
      acc[key] = deserializer(key, input)
      return acc
    }, {})
    return fromRecord(deserialized) as Try<T>
  }
}
