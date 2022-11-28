import { DefaultConfig } from '@oats-ts/validators'
import { isNil, encode, decode } from './utils'

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

  protected append(path: string, ...segments: (string | number)[]): string {
    return DefaultConfig.append(path, ...segments)
  }
}
