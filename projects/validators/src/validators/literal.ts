import { typed } from '../typed'
import { ValidatorConfig } from '../typings'

const Type = 'literal' as const

export const literal = (value: string | number | boolean | null) =>
  typed((input: any, path: string, config: ValidatorConfig) => {
    const severity = config.severity(Type)!
    if (value !== input) {
      return [
        {
          message: `should be ${typeof value === 'string' ? `"${value}"` : value}`,
          path,
          severity,
        },
      ]
    }
    return []
  }, Type)
