import { ParameterType, PathDslRoot } from './types'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { fluent, fromRecord, Try } from '@oats-ts/try'
import { parsePathToSegments } from './common'
import { validatePathSerializers } from './serializers/path/pathUtils'
import { createPathSerializers } from './createPathSerializers'

export function createPathSerializer<T extends ParameterType>(root: PathDslRoot<T>, path: string) {
  const serializers = createPathSerializers(root)
  const segments = parsePathToSegments(path)
  validatePathSerializers(segments, serializers)

  return function pathSerializer(
    input: T,
    path: string = 'path',
    config: ValidatorConfig = DefaultConfig,
  ): Try<string> {
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
