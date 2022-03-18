import { jsonPathAppender } from './jsonPathAppender'
import { ValidatorConfig } from './typings'

export const DefaultConfig: ValidatorConfig = {
  append: jsonPathAppender,
  severities: undefined,
}

export const DefaultPath = '$'
