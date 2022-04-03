import { prettierFormatter } from '@oats-ts/typescript-writer'
import { Options } from 'prettier'

const prettier: (options: Options) => (code: string) => string = prettierFormatter

export const formatters = {
  prettier,
} as const
