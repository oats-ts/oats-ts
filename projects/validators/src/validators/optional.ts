import { Validator, ValidatorConfig } from '../typings'
import { isNil } from '../utils'

export const optional =
  (validator?: Validator<any>): Validator<any> =>
  (input: any, path: string, config: ValidatorConfig) => {
    if (isNil(input)) {
      return []
    }
    if (isNil(validator)) {
      return []
    }
    return validator(input, path, config)
  }
