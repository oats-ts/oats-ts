import { Try, fluent, fromRecord } from '@oats-ts/try'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { ParameterType, ParameterValue, PathDeserializer, PathDeserializers } from '../../types'
import { parseRawPath } from './parseRawPath'

export const createPathDeserializer = <T extends ParameterType>(
  parameterNames: string[],
  regex: RegExp,
  deserializers: PathDeserializers<T>,
): PathDeserializer<T> => {
  return (input: string, path: string = 'path', config: ValidatorConfig = DefaultConfig): Try<T> => {
    return fluent(parseRawPath(parameterNames, regex, input, path))
      .flatMap((raw) => {
        const deserialized = Object.keys(deserializers).reduce(
          (acc: Record<string, Try<ParameterValue>>, key: string) => {
            const deserializer = deserializers[key]
            acc[key] = deserializer(raw, key, config.append(path, key), config)
            return acc
          },
          {},
        )
        return fromRecord(deserialized) as Try<T>
      })
      .toTry()
  }
}
