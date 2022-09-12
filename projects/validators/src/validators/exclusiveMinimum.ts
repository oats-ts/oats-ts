import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const exclusiveMinimum =
  (min: number): Validator<number> =>
  (input: number, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('exclusiveMinimum', path)
    if (isNil(severity)) {
      return []
    }
    if (input <= min) {
      return [
        {
          message: config.message('exclusiveMinimum', path, {
            type: 'exclusiveMinimum',
            input,
            hint: min,
          }),
          path,
          severity,
        },
      ]
    }
    return []
  }
