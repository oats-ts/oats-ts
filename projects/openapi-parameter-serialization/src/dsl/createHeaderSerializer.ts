import { HeaderDslRoot, ParameterType } from './types'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { fromRecord, isFailure, isSuccess, Try } from '@oats-ts/try'
import { createHeaderSerializers } from './createHeaderSerializers'
import { isNil } from '../common/utils'

export function createHeaderSerializer<T extends ParameterType>(root: HeaderDslRoot<T>) {
  const serializers = createHeaderSerializers(root)
  return function headerSerializer(
    input: T,
    path: string = 'headers',
    config: ValidatorConfig = DefaultConfig,
  ): Try<Record<string, string>> {
    const serializedParts = Object.keys(serializers).reduce((parts: Record<string, Try<string>>, key: string) => {
      const serializer = serializers[key]
      const inputValue = input?.[key as keyof T]
      const value = serializer(inputValue, key, config.append(path, key as string | number), config)
      if ((isSuccess(value) && !isNil(value.data)) || isFailure(value)) {
        parts[key.toString().toLowerCase()] = value as Try<string>
      }
      return parts
    }, {})
    return fromRecord(serializedParts)
  }
}
