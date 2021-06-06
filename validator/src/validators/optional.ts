import { any } from './any'
import { Issue, Validator, ValidatorConfig } from '../typings'
import { isNil } from '../utils'

export const optional =
  (validator: Validator<any> = any): Validator<any> =>
  (input: any, config: ValidatorConfig): Issue[] => {
    return isNil(input) ? [] : validator(input, config)
  }
