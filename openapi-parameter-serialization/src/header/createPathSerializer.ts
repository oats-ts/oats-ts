import { HeaderSerializers, ParameterObject } from '../types'

export const createPathSerializer =
  <T extends ParameterObject>(serializers: HeaderSerializers<T>) =>
  (input: T): Record<string, string> => {
    const keys = Object.keys(serializers)
    const serialized: Record<string, string> = {}

    for (let i = 0; i < keys.length; i += 1) {
      const name = keys[i] as keyof T
      const serializer = serializers[name]
      serialized[name as string] = serializer(name.toString())(input[name])
    }

    return serialized
  }
