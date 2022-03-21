import { ParameterObject, PathSerializers } from '../types'
import { parsePathToSegments } from '@oats-ts/openapi-parameter-common'
import { validatePathSerializers } from './pathUtils'
import { fluent, fromRecord, Try } from '@oats-ts/try'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'

export const createPathSerializer = <T extends ParameterObject>(path: string, serializers: PathSerializers<T>) => {
  const segments = parsePathToSegments(path)
  validatePathSerializers(segments, serializers)
  return (input: T, path: string = 'path', config: ValidatorConfig = DefaultConfig): Try<string> => {
    const serializedParts = fromRecord(
      Object.keys(serializers).reduce((parts: Record<string, Try<string>>, name: string) => {
        const serializer = serializers[name]
        parts[name] = serializer(input[name] as any, name, config.append(path, name), config)
        return parts
      }, {}),
    )

    return fluent(serializedParts).map((serialized) => {
      return segments
        .map((segment) => {
          switch (segment.type) {
            case 'parameter':
              return serialized[segment.name]
            case 'text':
              return segment.value
          }
        })
        .join('')
    })
  }
}
