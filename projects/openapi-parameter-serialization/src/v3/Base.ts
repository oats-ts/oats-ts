import { DefaultConfig } from '@oats-ts/validators'
import { isNil } from './utils'

export abstract class Base {
  protected abstract basePath(): string

  protected decode(value: string): string
  protected decode(value?: string): string | undefined {
    return isNil(value) ? undefined : decodeURIComponent(value)
  }

  protected encode(value?: string): string {
    return isNil(value)
      ? ''
      : encodeURIComponent(`${value}`).replace(
          /[\.,;=!'()*]/g,
          (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
        )
  }

  protected append(path: string, ...segments: (string | number)[]): string {
    return DefaultConfig.append(path, ...segments)
  }
}
