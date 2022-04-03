import { Options, format } from 'prettier'

export const prettierFormatter =
  (options: Options) =>
  (code: string): string =>
    format(code, options)
