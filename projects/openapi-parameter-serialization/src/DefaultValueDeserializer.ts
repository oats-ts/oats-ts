import { failure, isSuccess, success, Try } from '@oats-ts/try'
import {
  BooleanDescriptor,
  EnumDescriptor,
  LiteralDescriptor,
  NumberDescriptor,
  OptionalDescriptor,
  Primitive,
  StringDescriptor,
  ValueDeserializer,
  ValueDescriptor,
  UnionDescriptor,
} from './types'
import { isNil } from './utils'

export class DefaultValueDeserializer implements ValueDeserializer {
  public deserialize(descriptor: ValueDescriptor, data: Primitive, path: string): Try<Primitive> {
    switch (descriptor.type) {
      case 'boolean':
        return this.boolean(descriptor, data, path)
      case 'enum':
        return this.enumeration(descriptor, data, path)
      case 'literal':
        return this.literal(descriptor, data, path)
      case 'number':
        return this.number(descriptor, data, path)
      case 'optional':
        return this.optional(descriptor, data, path)
      case 'string':
        return this.string(descriptor, data, path)
      case 'union':
        return this.union(descriptor, data, path)
    }
  }

  protected union(descriptor: UnionDescriptor, value: Primitive, path: string): Try<Primitive> {
    for (let i = 0; i < descriptor.values.length; i += 1) {
      const d = descriptor.values[i]
      const v = this.deserialize(d, value, path)
      if (isSuccess(v)) {
        return v
      }
    }
    return failure({
      message: `should be one of ${descriptor.values.map((v) => `"${v.type}"`).join(', ')}`,
      path,
      severity: 'error',
    })
  }

  protected boolean(descriptor: BooleanDescriptor, value: Primitive, path: string): Try<Primitive> {
    if (value !== 'true' && value !== 'false') {
      return failure({
        message: `should be a boolean ("true" or "false")`,
        path,
        severity: 'error',
      })
    }
    const boolValue = value === 'true'
    return isNil(descriptor.value) ? success(boolValue) : this.deserialize(descriptor.value, boolValue, path)
  }

  protected enumeration(descriptor: EnumDescriptor, value: Primitive, path: string): Try<Primitive> {
    if (descriptor.values.indexOf(value) < 0) {
      const valuesLiteral = descriptor.values.map((v) => (typeof v === 'string' ? `"${v}"` : `${v}`)).join(',')
      return failure({
        message: `should be one of ${valuesLiteral}.`,
        path,
        severity: 'error',
      })
    }
    return success(value)
  }

  protected literal(descriptor: LiteralDescriptor, value: Primitive, path: string): Try<Primitive> {
    if (value !== descriptor.value) {
      const strLiteral = typeof descriptor.value === 'string' ? `"${descriptor.value}"` : descriptor.value
      return failure({
        message: `should be ${strLiteral}.`,
        path,
        severity: 'error',
      })
    }
    return success(value)
  }

  protected number(descriptor: NumberDescriptor, value: Primitive, path: string): Try<Primitive> {
    if (typeof value !== 'string') {
      return failure({
        message: `should not be ${value}`,
        path,
        severity: 'error',
      })
    }
    const numValue = Number(value)
    if (value.length === 0 || isNaN(numValue)) {
      return failure({
        message: `should be a number, but was ${value}`,
        path,
        severity: 'error',
      })
    }
    return isNil(descriptor.value) ? success(numValue) : this.deserialize(descriptor.value, numValue, path)
  }

  protected optional(descriptor: OptionalDescriptor, value: Primitive, path: string): Try<Primitive> {
    return isNil(value) ? success(undefined) : this.deserialize(descriptor.value, value, path)
  }

  protected string(descriptor: StringDescriptor, value: Primitive, path: string): Try<Primitive> {
    if (typeof value !== 'string') {
      return failure({
        message: `should be a string.`,
        path,
        severity: 'error',
      })
    }
    return isNil(descriptor.value) ? success(value) : this.deserialize(descriptor.value, value, path)
  }
}
