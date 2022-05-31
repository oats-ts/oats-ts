import { defaultTextColors } from './defaultTextColors'
import { Logger, TextColors } from './typings'

export class DefaultLogger implements Logger {
  private level: number
  private name: string | undefined

  public colors: TextColors = defaultTextColors

  public constructor(name: string | undefined = undefined, level: number = 0) {
    this.name = name
    this.level = level
  }

  public log(input: string): void {
    console.log(input)
  }
  public info(input: string): void {
    console.log(`${this.i()} ${input}`)
  }
  public success(input: string): void {
    console.log(`${this.c()} ${input}`)
  }
  public warn(input: string): void {
    console.log(`${this.w()} ${input}`)
  }
  public error(input: string): void {
    console.log(`${this.x()} ${input}`)
  }
  public child(name?: string): Logger {
    return new DefaultLogger(name, this.level + 1)
  }
  public create(name?: string): Logger {
    return new DefaultLogger(name)
  }
  public static create(name?: string): Logger {
    return new DefaultLogger(name)
  }

  private x() {
    return this.colors.red('✕')
  }
  private c() {
    return this.colors.green('✔')
  }
  private w() {
    return this.colors.yellow('!')
  }
  private i() {
    return this.colors.yellow('i')
  }
}
