import { failure, success, Try } from '@oats-ts/try'
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
  ValueSerializer,
} from './types'
import { isNil } from './utils'

export class DefaultValueSerializer implements ValueSerializer {
  public serialize(descriptor: ValueDescriptor, data: Primitive, path: string): Try<string | undefined> {
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
    }
  }

  protected boolean(descriptor: BooleanDescriptor, value: Primitive, path: string): Try<string | undefined> {
    if (typeof value !== 'boolean') {
      return failure({
        message: `should be a boolean (true or false)`,
        path,
        severity: 'error',
      })
    }
    return isNil(descriptor.value) ? success(this.stringify(value)) : this.serialize(descriptor.value, value, path)
  }

  protected enumeration(descriptor: EnumDescriptor, value: Primitive, path: string): Try<string | undefined> {
    if (descriptor.values.indexOf(value) < 0) {
      const valuesLiteral = descriptor.values.map((v) => (typeof v === 'string' ? `"${v}"` : `${v}`)).join(',')
      return failure({
        message: `should be one of ${valuesLiteral}.`,
        path,
        severity: 'error',
      })
    }
    return success(this.stringify(value))
  }

  protected literal(descriptor: LiteralDescriptor, value: Primitive, path: string): Try<string | undefined> {
    if (value !== descriptor.value) {
      const strLiteral = typeof descriptor.value === 'string' ? `"${descriptor.value}"` : descriptor.value
      return failure({
        message: `should be ${strLiteral}.`,
        path,
        severity: 'error',
      })
    }
    return success(this.stringify(value))
  }

  protected number(descriptor: NumberDescriptor, value: Primitive, path: string): Try<string | undefined> {
    if (typeof value !== 'number') {
      return failure({
        message: `should be a number`,
        path,
        severity: 'error',
      })
    }
    return isNil(descriptor.value) ? success(this.stringify(value)) : this.serialize(descriptor.value, value, path)
  }

  protected optional(descriptor: OptionalDescriptor, value: Primitive, path: string): Try<string | undefined> {
    return isNil(value) ? success(undefined) : this.serialize(descriptor.value, value, path)
  }

  protected string(descriptor: StringDescriptor, value: Primitive, path: string): Try<string | undefined> {
    if (typeof value !== 'string') {
      return failure({
        message: `should be a string.`,
        path,
        severity: 'error',
      })
    }
    return isNil(descriptor.value) ? success(value) : this.serialize(descriptor.value, value, path)
  }

  protected stringify(value: Primitive): string {
    return `${value}`
  }
}
