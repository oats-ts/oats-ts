import {
  BooleanParameterRule,
  NumberParameterRule,
  OptionalParameterRule,
  StringParameterRule,
  UnionParameterRule,
  ValueParameterRule,
} from '@oats-ts/rules'
import { failure, isSuccess, success, Try } from '@oats-ts/try'
import { Primitive, ValueDeserializer } from './types'
import { isNil } from './utils'

export class DefaultValueDeserializer implements ValueDeserializer {
  public deserialize(rule: ValueParameterRule, data: Primitive, path: string): Try<Primitive> {
    switch (rule.type) {
      case 'boolean':
        return this.boolean(rule, data, path)
      case 'number':
        return this.number(rule, data, path)
      case 'optional':
        return this.optional(rule, data, path)
      case 'string':
        return this.string(rule, data, path)
      case 'union':
        return this.union(rule, data, path)
    }
  }

  protected union(rule: UnionParameterRule, value: Primitive, path: string): Try<Primitive> {
    for (let i = 0; i < rule.alternatives.length; i += 1) {
      const d = rule.alternatives[i]
      const v = this.deserialize(d, value, path)
      if (isSuccess(v)) {
        return v
      }
    }
    return failure({
      message: `should be one of ${rule.alternatives.map((v) => `"${v.type}"`).join(', ')}`,
      path,
      severity: 'error',
    })
  }

  protected boolean(rule: BooleanParameterRule, value: Primitive, path: string): Try<Primitive> {
    if (value !== 'true' && value !== 'false') {
      return failure({
        message: `should be a boolean ("true" or "false")`,
        path,
        severity: 'error',
      })
    }
    return success(value === 'true')
  }

  protected number(rule: NumberParameterRule, value: Primitive, path: string): Try<Primitive> {
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
    return success(numValue)
  }

  protected optional(rule: OptionalParameterRule, value: Primitive, path: string): Try<Primitive> {
    return isNil(value) ? success(undefined) : this.deserialize(rule.value, value, path)
  }

  protected string(rule: StringParameterRule, value: Primitive, path: string): Try<Primitive> {
    if (typeof value !== 'string') {
      return failure({
        message: `should be a string.`,
        path,
        severity: 'error',
      })
    }
    return success(value)
  }
}
