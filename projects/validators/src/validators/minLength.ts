import { typed } from '../typed'
import { ValidatorConfig } from '../typings'
import { isNil } from '../utils'

const Type = 'minLength' as const

export const minLength = (length: number) =>
  typed((input: { length: number }, path: string, config: ValidatorConfig) => {
    const severity = config.severity(Type)!
    if (input.length < length) {
      return [
        {
          message: `length should be at least ${length}`,
          path,
          severity,
        },
      ]
    }
    return []
  }, Type)
