import { Try, fromArray, fluent } from '@oats-ts/try'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { ParameterType, QuerySerializer, QuerySerializers } from '../../types'

export const createQuerySerializer =
  <T extends ParameterType>(serializers: QuerySerializers<T>): QuerySerializer<T> =>
  (input: T, path: string = 'query', config: ValidatorConfig = DefaultConfig): Try<string | undefined> => {
    const serializedParts = fromArray(
      Object.keys(serializers).map((name: string) => {
        const key = name as keyof T
        const serializer = serializers[key]
        return serializer(input[key], name, config.append(path, name), config)
      }),
    )
    return fluent(serializedParts)
      .map((parts: string[][]): string[] => parts.reduce((flat, arr) => [...flat, ...arr], []))
      .map((parts) => (parts.length === 0 ? undefined : `?${parts.join('&')}`))
  }
