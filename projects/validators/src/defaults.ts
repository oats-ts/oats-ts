import { jsonPathAppender } from './jsonPathAppender'
import { ValidatorConfig } from './typings'

export const DefaultConfig: ValidatorConfig = {
  append: jsonPathAppender,
  severity: () => 'error',
}

export const DefaultPath = '$'
