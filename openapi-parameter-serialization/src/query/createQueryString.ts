import { ParameterObject, Serializer } from '../types'

export const createQueryString =
  <T extends ParameterObject>(serializers: { [P in keyof T]: Serializer<T[P]> }) =>
  (input: T): string => {
    const parts: string[] = []
    const keys = Object.keys(serializers)

    for (let i = 0; i < keys.length; i += 1) {
      const name = keys[i] as keyof T
      const serializer = serializers[name]
      parts.push(...serializer(name.toString())(input[name]))
    }

    return parts.length === 0 ? undefined : `?${parts.join('&')}`
  }
