import { ParameterObject, QueryDeserializers } from '../types'
import { parseRawQuery } from './parseRawQuery'

export const createQueryDeserializer =
  <T extends ParameterObject>(deserializers: QueryDeserializers<T>) =>
  (input: string): T => {
    const raw = parseRawQuery(input)
    const output: ParameterObject = {}
    const keys = Object.keys(deserializers)

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i]
      const deserializer = deserializers[key]
      output[key] = deserializer(key)(raw)
    }

    return output as T
  }
