import { append } from './append'
import { ValidatorConfig } from './typings'

export const DefaultConfig: ValidatorConfig = {
  append: append,
  severity: () => 'error',
}

export const DefaultPath = '$'
