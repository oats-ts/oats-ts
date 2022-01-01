import { Try, fromArray, fluent } from '@oats-ts/try'
import { ParameterObject, QuerySerializers } from '../types'

export const createQuerySerializer =
  <T extends ParameterObject>(serializers: QuerySerializers<T>) =>
  (input: T): Try<string> => {
    const serializedParts = fromArray(
      Object.keys(serializers).map((name: string) => {
        const key = name as keyof T
        const serializer = serializers[key]
        return serializer(name.toString(), input[key])
      }),
    )
    return fluent(serializedParts)
      .map((parts: string[][]): string[] => parts.reduce((flat, arr) => [...flat, ...arr], []))
      .map((parts) => (parts.length === 0 ? undefined : `?${parts.join('&')}`))
  }
