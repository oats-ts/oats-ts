import { typed } from '../typed'
import { Validator, ValidatorConfig } from '../typings'
import { isNil } from '../utils'

const Type = 'union' as const

/** TODO better way of representing the issues. */
export const union = (validators: Record<string, Validator<any>>) =>
  typed((input: any, path: string, config: ValidatorConfig) => {
    const keys = Object.keys(validators)
    const severity = config.severity(Type)!

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i]
      const validator = validators[key]
      const children = validator(input, path, config)
      if (children.length === 0) {
        return []
      }
    }

    return [
      {
        message: `should be one of [${keys.join(', ')}]`,
        path: path,
        severity,
      },
    ]
  }, 'union')
