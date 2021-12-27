import { Try, flatMap, mapRecord } from '@oats-ts/try'
import { ParameterObject, PathDeserializers, ParameterValue } from '../types'
import { createRawPathParser } from './createRawPathParser'

export const createPathDeserializer = <T extends ParameterObject>(
  parameterNames: string[],
  regex: RegExp,
  deserializers: PathDeserializers<T>,
) => {
  const parseRawPath = createRawPathParser(parameterNames, regex)
  return (input: string): Try<T> => {
    return flatMap(parseRawPath(input), (raw) => {
      const keys = Object.keys(deserializers)
      const output = mapRecord(keys, (key): Try<ParameterValue> => {
        const deserializer = deserializers[key]
        return deserializer(key)(raw)
      })
      return output as Try<T>
    })
  }
}
