import { HeaderSerializers, ParameterObject } from '../types'
import { isNil } from '../utils'

export const createHeaderSerializer =
  <T extends ParameterObject>(serializers: HeaderSerializers<T>) =>
  (input: T): Record<string, string> => {
    const keys = Object.keys(serializers)
    const headers: Record<string, string> = {}

    for (let i = 0; i < keys.length; i += 1) {
      const name = keys[i] as keyof T
      const serializer = serializers[name]
      const key = name.toString().toLowerCase()
      const value = serializer(name.toString(), input[name])
      if (!isNil(value)) {
        headers[key] = value
      }
    }

    return headers
  }
