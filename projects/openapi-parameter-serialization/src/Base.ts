import { encode, decode } from './utils'
import { appendPath } from '@oats-ts/validators'

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
}
