import { failure, isSuccess, success, Try } from '@oats-ts/try'
import {
  BooleanDescriptor,
  NumberDescriptor,
  OptionalDescriptor,
  Primitive,
  UnionDescriptor,
  StringDescriptor,
  ValueDescriptor,
  ValueSerializer,
} from './types'
import { isNil } from './utils'

export class DefaultValueSerializer implements ValueSerializer {
  public serialize(descriptor: ValueDescriptor, data: Primitive, path: string): Try<string | undefined> {
    switch (descriptor.type) {
      case 'boolean':
        return this.boolean(descriptor, data, path)
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

  protected union(descriptor: UnionDescriptor, value: Primitive, path: string): Try<string | undefined> {
    for (let i = 0; i < descriptor.values.length; i += 1) {
      const d = descriptor.values[i]
      const v = this.serialize(d, value, path)
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
