import {
  ParameterValue,
  PathOptions,
  Primitive,
  PrimitiveArray,
  PrimitiveRecord,
  ParameterObject,
  ParameterSegment,
  PathSegment,
  PathSerializers,
} from '../types'
import { isNil } from '../utils'

export function validatePathArray<T extends PrimitiveArray>(name: string, input: T): T {
  switch (input.length) {
    case 0: {
      throw new Error(`Array "${name}" should not be empty`)
    }
    case 1: {
      const [head] = input
      if (`${head}`.length === 0) {
        throw new Error(`Array "${name}" should not have a single 0 length item`)
      }
      return input
    }
    default:
      return input
  }
}

export function validatePathObject<T extends PrimitiveRecord>(name: string, input: T): T {
  const keys = Object.keys(input)
  switch (keys.length) {
    case 0: {
      throw new Error(`Object "${name}" should not be empty`)
    }
    default:
      return input
  }
}

export function validatePathPrimitive<T extends Primitive>(name: string, input: T): T {
  switch (`${input}`.length) {
    case 0: {
      throw new Error(`Primitive "${name}" should not be empty (serializing to 0 length string)`)
    }
    default:
      return input
  }
}

export function getPathValue<T extends ParameterValue>(name: string, value: T, options: PathOptions<T>): T {
  if (!isNil(value)) {
    return value
  }
  if (!isNil(options.defaultValue)) {
    return options.defaultValue
  }
  throw new TypeError(`Path parameter "${name}" should not be ${value}`)
}

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
