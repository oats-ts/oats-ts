export type ColorFn = (input: string) => string
export type LoggerFn = (input: string) => void
export type FactoryFn = (name?: string) => Logger

export type TextColors = {
  red: ColorFn
  green: ColorFn
  blue: ColorFn
  yellow: ColorFn
}

export type Logger = {
  log: LoggerFn
  info: LoggerFn
  warn: LoggerFn
  error: LoggerFn
  success: LoggerFn
  child: FactoryFn
  colors: TextColors
}
