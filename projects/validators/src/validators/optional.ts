import { typed } from '../typed'
import { Validator, ValidatorConfig } from '../typings'
import { isNil } from '../utils'

const Type = 'optional' as const

export const optional = (validator?: Validator<any>) =>
  typed((input: any, path: string, config: ValidatorConfig) => {
    if (isNil(input)) {
      return []
    }
    if (isNil(validator)) {
      return []
    }
    return validator(input, path, config)
  }, Type)
