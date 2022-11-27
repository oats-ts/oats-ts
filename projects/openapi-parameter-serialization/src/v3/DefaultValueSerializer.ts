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
  ValueSerializer,
} from './types'
import { isNil } from './utils'

export class DefaultValueSerializer implements ValueSerializer {
  public serialize(dsl: ValueDsl, data: Primitive, path: string): Try<string | undefined> {
    switch (dsl.type) {
      case 'boolean':
        return this.boolean(dsl, data, path)
      case 'enum':
        return this.enumeration(dsl, data, path)
      case 'literal':
        return this.literal(dsl, data, path)
      case 'number':
        return this.number(dsl, data, path)
      case 'optional':
        return this.optional(dsl, data, path)
      case 'string':
        return this.string(dsl, data, path)
    }
  }

  protected boolean(dsl: BooleanDsl, value: Primitive, path: string): Try<string | undefined> {
    if (typeof value !== 'boolean') {
      return failure({
        message: `should be a boolean (true or false)`,
        path,
        severity: 'error',
      })
    }
    return isNil(dsl.dsl) ? success(this.stringify(value)) : this.serialize(dsl.dsl, value, path)
  }

  protected enumeration(dsl: EnumDsl, value: Primitive, path: string): Try<string | undefined> {
    if (dsl.values.indexOf(value) < 0) {
      const valuesLiteral = dsl.values.map((v) => (typeof v === 'string' ? `"${v}"` : `${v}`)).join(',')
      return failure({
        message: `should be one of ${valuesLiteral}.`,
        path,
        severity: 'error',
      })
    }
    return success(this.stringify(value))
  }

  protected literal(dsl: LiteralDsl, value: Primitive, path: string): Try<string | undefined> {
    if (value !== dsl.value) {
      const strLiteral = typeof dsl.value === 'string' ? `"${dsl.value}"` : dsl.value
      return failure({
        message: `should be ${strLiteral}.`,
        path,
        severity: 'error',
      })
    }
    return success(this.stringify(value))
  }

  protected number(dsl: NumberDsl, value: Primitive, path: string): Try<string | undefined> {
    if (typeof value !== 'number') {
      return failure({
        message: `should be a number`,
        path,
        severity: 'error',
      })
    }
    return isNil(dsl.dsl) ? success(this.stringify(value)) : this.serialize(dsl.dsl, value, path)
  }

  protected optional(dsl: OptionalDsl, value: Primitive, path: string): Try<string | undefined> {
    return isNil(value) ? success(undefined) : this.serialize(dsl.dsl, value, path)
  }

  protected string(dsl: StringDsl, value: Primitive, path: string): Try<string | undefined> {
    if (typeof value !== 'string') {
      return failure({
        message: `should be a string.`,
        path,
        severity: 'error',
      })
    }
    return isNil(dsl.dsl) ? success(value) : this.serialize(dsl.dsl, value, path)
  }

  protected stringify(value: Primitive): string {
    return `${value}`
  }
}
