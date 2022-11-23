import { failure, success, Try } from '@oats-ts/try'
import {
  BooleanDsl,
  EnumDsl,
  LiteralDsl,
  NumberDsl,
  OptionalDsl,
  Primitive,
  StringDsl,
  ValueDeserializer,
  ValueDsl,
} from './types'
import { isNil } from './utils'

export class DefaultValueDeserializer implements ValueDeserializer {
  public deserialize(dsl: ValueDsl, data: Primitive, name: string, path: string): Try<Primitive> {
    switch (dsl.type) {
      case 'boolean':
        return this.boolean(dsl, data, name, path)
      case 'enum':
        return this.enumeration(dsl, data, name, path)
      case 'literal':
        return this.literal(dsl, data, name, path)
      case 'number':
        return this.number(dsl, data, name, path)
      case 'optional':
        return this.optional(dsl, data, name, path)
      case 'string':
        return this.string(dsl, data, name, path)
    }
  }

  protected boolean(dsl: BooleanDsl, value: Primitive, name: string, path: string): Try<Primitive> {
    if (value !== 'true' && value !== 'false') {
      return failure({
        message: `should be a boolean ("true" or "false")`,
        path,
        severity: 'error',
      })
    }
    const boolValue = value === 'true'
    return isNil(dsl.dsl) ? success(boolValue) : this.deserialize(dsl.dsl, boolValue, name, path)
  }

  protected enumeration(dsl: EnumDsl, value: Primitive, name: string, path: string): Try<Primitive> {
    if (dsl.values.indexOf(value) < 0) {
      const valuesLiteral = dsl.values.map((v) => (typeof v === 'string' ? `"${v}"` : `${v}`)).join(',')
      return failure({
        message: `should be one of ${valuesLiteral}.`,
        path,
        severity: 'error',
      })
    }
    return success(value)
  }

  protected literal(dsl: LiteralDsl, value: Primitive, name: string, path: string): Try<Primitive> {
    if (value !== dsl.value) {
      const strLiteral = typeof dsl.value === 'string' ? `"${dsl.value}"` : dsl.value
      return failure({
        message: `should be ${strLiteral}.`,
        path,
        severity: 'error',
      })
    }
    return success(value)
  }

  protected number(dsl: NumberDsl, value: Primitive, name: string, path: string): Try<Primitive> {
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
    return isNil(dsl.dsl) ? success(numValue) : this.deserialize(dsl.dsl, numValue, name, path)
  }

  protected optional(dsl: OptionalDsl, value: Primitive, name: string, path: string): Try<Primitive> {
    return isNil(value) ? success(undefined) : this.deserialize(dsl.dsl, value, name, path)
  }

  protected string(dsl: StringDsl, value: Primitive, name: string, path: string): Try<Primitive> {
    if (typeof value !== 'string') {
      return failure({
        message: `should be a string.`,
        path,
        severity: 'error',
      })
    }
    return isNil(dsl.dsl) ? success(value) : this.deserialize(dsl.dsl, value, name, path)
  }
}
