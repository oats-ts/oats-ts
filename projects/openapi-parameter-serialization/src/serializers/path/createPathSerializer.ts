import { validatePathSerializers } from './pathUtils'
import { fluent, fromRecord, Try } from '@oats-ts/try'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { parsePathToSegments } from '../../parsePathToSegments'
import { ParameterType, PathSerializer, PathSerializers } from '../../types'

export const createPathSerializer = <T extends ParameterType>(
  path: string,
  serializers: PathSerializers<T>,
): PathSerializer<T> => {
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
