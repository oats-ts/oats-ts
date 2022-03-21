import { fromRecord, isFailure, isSuccess, Try } from '@oats-ts/try'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { HeaderSerializers, ParameterObject } from '../types'
import { isNil } from '../utils'

export const createHeaderSerializer =
  <T extends ParameterObject>(serializers: HeaderSerializers<T>) =>
  (input: T, path: string = 'headers', config: ValidatorConfig = DefaultConfig): Try<Record<string, string>> => {
    const serializedParts = Object.keys(serializers).reduce((parts: Record<string, Try<string>>, key: string) => {
      const serializer = serializers[key as keyof T]
      const inputValue = input[key as keyof T]
      const value = serializer(inputValue, key, config.append(path, key as string | number), config)
      if ((isSuccess(value) && !isNil(value.data)) || isFailure(value)) {
        parts[key.toString().toLowerCase()] = value
      }
      return parts
    }, {})
    return fromRecord(serializedParts)
  }
