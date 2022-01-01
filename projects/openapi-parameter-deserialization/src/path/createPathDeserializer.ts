import { Try, fluent, fromRecord } from '@oats-ts/try'
import { ParameterObject, PathValueDeserializers, ParameterValue, PathDeserializer } from '../types'
import { createRawPathParser } from './createRawPathParser'

export const createPathDeserializer = <T extends ParameterObject>(
  parameterNames: string[],
  regex: RegExp,
  deserializers: PathValueDeserializers<T>,
): PathDeserializer<T> => {
  const parseRawPath = createRawPathParser(parameterNames, regex)
  return (input: string): Try<T> => {
    return fluent(parseRawPath(input))
      .flatMap((raw) => {
        const deserialized = Object.keys(deserializers).reduce(
          (acc: Record<string, Try<ParameterValue>>, key: string) => {
            const deserializer = deserializers[key]
            acc[key] = deserializer(key, raw)
            return acc
          },
          {},
        )
        return fromRecord(deserialized) as Try<T>
      })
      .toJson()
  }
}
