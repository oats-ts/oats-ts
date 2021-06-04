import { ParameterValue, Serializer } from '../types'

export const createQueryString =
  <T>(serializers: Record<keyof T, Serializer>) =>
  (input: Record<keyof T, ParameterValue>): string => {
    const parts: string[] = []
    const keys = Object.keys(serializers)

    for (let i = 0; i < keys.length; i += 1) {
      const name = keys[i]
      const serializer = serializers[name as keyof T]
      parts.push(serializer(name)(input[name as keyof T]))
    }

    return parts.length === 0 ? undefined : `?${parts.join('&')}`
  }
