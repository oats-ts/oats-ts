import { failure, success, Try } from '@oats-ts/try'
import { ParameterSegment, ParameterValue, PathSegment, PathSerializers, Primitive, PrimitiveRecord } from '../../types'
import { isNil } from '../../utils'

export function validatePathArray<T extends Primitive>(path: string, input: ReadonlyArray<T>): Try<ReadonlyArray<T>> {
  switch (input.length) {
    case 0: {
      return failure({
        message: `should not be empty`,
        path,
        severity: 'error',
      })
    }
    case 1: {
      const [head] = input
      if (`${head}`.length === 0) {
        return failure({
          message: `should not have a single 0 length item`,
          path,
          severity: 'error',
        })
      }
      return success(input)
    }
    default:
      return success(input)
  }
}

export function validatePathObject<T extends PrimitiveRecord>(path: string, input: T): Try<T> {
  const keys = Object.keys(input || {})
  switch (keys.length) {
    case 0: {
      return failure({
        message: `should not be empty`,
        path,
        severity: 'error',
      })
    }
    default:
      return success(input)
  }
}
export function validatePathPrimitive<T extends Primitive>(path: string, input: T): Try<T> {
  switch (`${input}`.length) {
    case 0: {
      return failure({
        message: 'should not be empty (attempting to serialize to 0 length string)',
        path,
        severity: 'error',
      })
    }
    default:
      return success(input)
  }
}

export function getPathValue<T extends ParameterValue>(path: string, value: T): Try<T> {
  if (!isNil(value)) {
    return success(value)
  }
  return failure({
    message: `should not be ${value}`,
    path,
    severity: 'error',
  })
}

export function validatePathSerializers(segments: PathSegment[], serializers: PathSerializers<any>): void {
  const parameterNames = segments
    .filter((segment): segment is ParameterSegment => segment.type === 'parameter')
    .map((segment) => segment.name)
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
