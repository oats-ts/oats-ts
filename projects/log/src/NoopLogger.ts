import { noopTextColors } from './noopTextColors'
import { Logger, TextColors } from './typings'

export class NoopLogger implements Logger {
  public colors: TextColors = noopTextColors
  
  public log(): void {
    /* noop */
  }
  public info(): void {
    /* noop */
  }
  public success(): void {
    /* noop */
  }
  public warn(): void {
    /* noop */
  }
  public error(): void {
    /* noop */
  }
  public child(): Logger {
    return this
  }
  public create(): Logger {
    return this
  }
  public static create(name?: string): Logger {
    return new NoopLogger()
  }
}
