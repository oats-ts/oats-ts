import { FullValidator, ValidatorConfig } from '../typings'
import { isNil } from '../utils'

export const optional =
  (validator?: FullValidator<any>): FullValidator<any> =>
  (input: any, path: string, config: ValidatorConfig) => {
    if (isNil(input)) {
      return []
    }
    if (isNil(validator)) {
      return []
    }
    return validator(input, path, config)
  }
