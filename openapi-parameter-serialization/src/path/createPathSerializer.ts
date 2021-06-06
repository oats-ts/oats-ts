import { ParameterObject, PathSerializers } from '../types'
import { parsePathToSegments } from './parsePathToSegments'
import { validatePathSerializers } from './pathUtils'

export const createPathSerializer = <T extends ParameterObject>(path: string, serializers: PathSerializers<T>) => {
  const segments = parsePathToSegments(path)
  validatePathSerializers(segments, serializers)
  return (input: T): string => {
    const keys = Object.keys(serializers)
    const serialized: Record<string, string> = {}

    for (let i = 0; i < keys.length; i += 1) {
      const name = keys[i] as keyof T
      const serializer = serializers[name]
      serialized[name as string] = serializer(name.toString())(input[name])
    }

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
  }
}
