import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const optional =
  (validator?: Validator<any>): Validator<any> =>
  (input: any, path: string, config: TypedValidatorConfig) => {
    if (isNil(config.severity('optional', path))) {
      return []
    }
    if (isNil(input)) {
      return []
    }
    if (isNil(validator)) {
      return []
    }
    return validator(input, path, config)
  }
