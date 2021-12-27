import { Try, mapRecord } from '@oats-ts/try'
import { HeaderDeserializers, RawHeaders, ParameterObject, ParameterValue } from '../types'

export const createHeaderDeserializer = <T extends ParameterObject>(deserializers: HeaderDeserializers<T>) => {
  return (input: RawHeaders): Try<T> => {
    const keys = Object.keys(deserializers)
    const output = mapRecord(keys, (key): Try<ParameterValue> => {
      const deserializer = deserializers[key]
      return deserializer(key)(input)
    })
    return output as Try<T>
  }
}
