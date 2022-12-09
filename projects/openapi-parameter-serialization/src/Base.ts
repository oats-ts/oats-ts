import { encode, decode } from './utils'
import { appendPath, isOk, Schema, Validator } from '@oats-ts/validators'
import { failure, success, Try } from '@oats-ts/try'

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

  protected validate<T>(schema: Schema, value: any): Try<T> {
    const validator = new Validator(schema, this.basePath())
    const issues = validator.validate(value)
    if (isOk(issues)) {
      return success(value)
    }
    return failure(...issues)
  }
}
