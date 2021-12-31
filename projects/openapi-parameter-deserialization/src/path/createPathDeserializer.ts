import { Try, flatMap } from '@oats-ts/try'
import { ParameterObject, PathValueDeserializers, ParameterValue, PathDeserializer } from '../types'
import { mapRecord } from '../utils'
import { createRawPathParser } from './createRawPathParser'

export const createPathDeserializer = <T extends ParameterObject>(
  parameterNames: string[],
  regex: RegExp,
  deserializers: PathValueDeserializers<T>,
): PathDeserializer<T> => {
  const parseRawPath = createRawPathParser(parameterNames, regex)
  return (input: string): Try<T> => {
    return flatMap(parseRawPath(input), (raw) => {
      const keys = Object.keys(deserializers)
      const output = mapRecord(keys, (key): Try<ParameterValue> => {
        const deserializer = deserializers[key]
        return deserializer(key, raw)
      })
      return output as Try<T>
    })
  }
}
