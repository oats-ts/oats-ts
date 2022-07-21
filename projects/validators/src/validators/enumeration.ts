import { typed } from '../typed'
import { ValidatorConfig } from '../typings'

const Type = 'enumeration' as const

/**
 * @deprecated Use union instead
 */
export const enumeration = <T>(values: T[]) =>
  typed((input: T, path: string, config: ValidatorConfig) => {
    const severity = config.severity(Type)!
    if (values.indexOf(input) < 0) {
      return [
        {
          message: `should be one of ${values}`,
          path,
          severity,
        },
      ]
    }
    return []
  }, Type)
