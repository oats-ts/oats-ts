import { fromRecord, isFailure, isSuccess, Try } from '@oats-ts/try'
import { HeaderSerializers, ParameterObject } from '../types'
import { isNil } from '../utils'

export const createHeaderSerializer =
  <T extends ParameterObject>(serializers: HeaderSerializers<T>) =>
  (input: T): Try<Record<string, string>> => {
    const serializedParts = Object.keys(serializers).reduce((parts: Record<string, Try<string>>, key: string) => {
      const name = key as keyof T
      const serializer = serializers[name]
      const value = serializer(name.toString(), input[name])
      if ((isSuccess(value) && !isNil(value.data)) || isFailure(value)) {
        parts[key.toString().toLowerCase()] = value
      }
      return parts
    }, {})
    return fromRecord(serializedParts)
  }
