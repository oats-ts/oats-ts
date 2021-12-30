import { Try } from '@oats-ts/try'
import { HeaderValueDeserializers, RawHeaders, ParameterObject, ParameterValue, HeaderDeserializer } from '../types'
import { mapRecord } from '../utils'

export const createHeaderDeserializer = <T extends ParameterObject>(
  deserializers: HeaderValueDeserializers<T>,
): HeaderDeserializer<T> => {
  return (input: RawHeaders): Try<T> => {
    const keys = Object.keys(deserializers)
    const output = mapRecord(keys, (key): Try<ParameterValue> => {
      const deserializer = deserializers[key]
      return deserializer(key, input)
    })
    return output as Try<T>
  }
}
