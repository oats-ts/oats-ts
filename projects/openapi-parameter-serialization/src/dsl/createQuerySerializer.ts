import { Try, fluent, fromArray } from '@oats-ts/try'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { createQuerySerializers } from './createQuerySerializers'
import { ParameterType, QueryDslRoot } from './types'

export function createQuerySerializer<T extends ParameterType>(dsl: QueryDslRoot<T>) {
  const serializers = createQuerySerializers(dsl)
  return function querySerializer(
    input: T,
    path: string = 'query',
    config: ValidatorConfig = DefaultConfig,
  ): Try<string | undefined> {
    const serializedParts = fromArray(
      Object.keys(serializers).map((name: string) => {
        const key = name as keyof T
        const serializer = serializers[name]
        return serializer(input[key], name, config.append(path, name), config)
      }),
    )
    return fluent(serializedParts)
      .map((parts: string[][]): string[] => parts.reduce((flat, arr) => [...flat, ...arr], []))
      .map((parts) => (parts.length === 0 ? undefined : `?${parts.join('&')}`))
  }
}
