import { ParameterObject, ParameterSegment, PathSegment, PathSerializers } from '../types'

export function validatePathSerializers<T extends ParameterObject>(
  segments: PathSegment[],
  serializers: PathSerializers<T>,
): void {
  const parameterNames = segments
    .filter((segment) => segment.type === 'parameter')
    .map((segment: ParameterSegment) => segment.name)
  const serializerKeys = Object.keys(serializers)

  const missingKeys = parameterNames.filter((name) => serializerKeys.indexOf(name) < 0)
  const extraKeys = serializerKeys.filter((key) => parameterNames.indexOf(key) < 0)
  const messages: string[] = [
    ...(missingKeys.length > 0 ? [`Serializers for parameters [${missingKeys.join(',')}] are missing.`] : []),
    ...(extraKeys.length > 0 ? [`Parameters [${extraKeys.join(',')}] do not exist in the given URL template.`] : []),
  ]
  if (messages.length > 0) {
    throw new Error(messages.join(' '))
  }
}
