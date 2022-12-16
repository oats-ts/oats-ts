import {
  BooleanParameterRule,
  NumberParameterRule,
  OptionalParameterRule,
  StringParameterRule,
  UnionParameterRule,
  ValueParameterRule,
} from '@oats-ts/rules'
import { failure, isSuccess, success, Try } from '@oats-ts/try'
import { Primitive, ValueSerializer } from './types'
import { isNil } from './utils'

export class DefaultValueSerializer implements ValueSerializer {
  public serialize(descriptor: ValueParameterRule, data: Primitive, path: string): Try<string | undefined> {
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

  protected union(descriptor: UnionParameterRule, value: Primitive, path: string): Try<string | undefined> {
    for (let i = 0; i < descriptor.alternatives.length; i += 1) {
      const d = descriptor.alternatives[i]
      const v = this.serialize(d, value, path)
      if (isSuccess(v)) {
        return v
      }
    }
    return failure({
      message: `should be one of ${descriptor.alternatives.map((v) => `"${v.type}"`).join(', ')}`,
      path,
      severity: 'error',
    })
  }

  protected boolean(descriptor: BooleanParameterRule, value: Primitive, path: string): Try<string | undefined> {
    if (typeof value !== 'boolean') {
      return failure({
        message: `should be a boolean (true or false)`,
        path,
        severity: 'error',
      })
    }
    return success(this.stringify(value))
  }

  protected number(descriptor: NumberParameterRule, value: Primitive, path: string): Try<string | undefined> {
    if (typeof value !== 'number') {
      return failure({
        message: `should be a number`,
        path,
        severity: 'error',
      })
    }
    return success(this.stringify(value))
  }

  protected optional(descriptor: OptionalParameterRule, value: Primitive, path: string): Try<string | undefined> {
    return isNil(value) ? success(undefined) : this.serialize(descriptor.value, value, path)
  }

  protected string(descriptor: StringParameterRule, value: Primitive, path: string): Try<string | undefined> {
    if (typeof value !== 'string') {
      return failure({
        message: `should be a string.`,
        path,
        severity: 'error',
      })
    }
    return success(value)
  }

  protected stringify(value: Primitive): string {
    return `${value}`
  }
}
