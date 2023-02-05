import { encode, decode, isNil } from './utils'
import { appendPath, isOk, DefaultValidator } from '@oats-ts/validators'
import { failure, success, Try } from '@oats-ts/try'
import { SchemaRule } from '@oats-ts/rules'

export abstract class Base {
  protected abstract basePath(): string

  protected decode(value: string): string
  protected decode(value?: string): string | undefined {
    // TODO type checking doesn't recognize the decode overload for some reason
    return decode(value!)
  }

  protected encode(value?: string): string {
    return encode(value!)
  }

  protected append(path: string, segment: string | number): string {
    return appendPath(path, segment)
  }

  protected validate<T>(schema: SchemaRule | undefined, value: any, path: string): Try<T> {
    if (isNil(schema)) {
      return success(value)
    }
    const validator = new DefaultValidator(schema, path)
    const issues = validator.validate(value)
    return isOk(issues) ? success(value) : failure(...issues)
  }
}
