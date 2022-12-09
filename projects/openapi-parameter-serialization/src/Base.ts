import { encode, decode, isNil } from './utils'
import { appendPath, isOk, Validator } from '@oats-ts/validators'
import { failure, success, Try } from '@oats-ts/try'
import { Location, SchemaDescriptor } from './types'

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

  protected validate<T>(descriptor: SchemaDescriptor<Location>, value: any, path: string): Try<T> {
    if (isNil(value) && !descriptor.required) {
      return success(value as unknown as T)
    }
    const validator = new Validator(descriptor.schema, path)
    const issues = validator.validate(value)
    if (isOk(issues)) {
      return success(value)
    }
    return failure(...issues)
  }
}
