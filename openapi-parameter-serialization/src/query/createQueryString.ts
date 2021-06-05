import { ParameterObject, Serializer } from '../types'

export const createQueryString =
  <T extends ParameterObject>(serializers: { [P in keyof T]: Serializer<T[P]> }) =>
  (input: T): string => {
    const parts: string[] = []
    const keys = Object.keys(serializers)

    for (let i = 0; i < keys.length; i += 1) {
      const name = keys[i]
      // TODO better typings here
      const serializer = serializers[name as keyof T]
      parts.push(serializer(name)(input[name as keyof T]))
    }

    return parts.length === 0 ? undefined : `?${parts.join('&')}`
  }
