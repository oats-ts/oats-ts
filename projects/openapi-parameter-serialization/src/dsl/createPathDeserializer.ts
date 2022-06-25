import { ParameterType, ParameterValue, PathDslRoot } from './types'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { fluent, fromRecord, Try } from '@oats-ts/try'
import { parseRawPath } from '../deserializers/path/parseRawPath'
import { createPathDeserializers } from './createPathDeserializers'
import { PathDeserializer } from '../deserializers/types'

export function createPathDeserializer<T extends ParameterType>(
  root: PathDslRoot<T>,
  parameterNames: string[],
  regex: RegExp,
): PathDeserializer<T> {
  const deserializers = createPathDeserializers(root)
  return function pathDeserializer(
    input: string,
    path: string = 'headers',
    config: ValidatorConfig = DefaultConfig,
  ): Try<T> {
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
