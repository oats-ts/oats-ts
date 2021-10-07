import { HeaderDeserializers, RawHeaders, ParameterObject } from '../types'

export const createHeaderParser = <T extends ParameterObject>(deserializers: HeaderDeserializers<T>) => {
  return (input: RawHeaders): T => {
    const output: ParameterObject = {}
    const keys = Object.keys(deserializers)

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i]
      const deserializer = deserializers[key]
      output[key] = deserializer(key)(input)
    }

    return output as T
  }
}
