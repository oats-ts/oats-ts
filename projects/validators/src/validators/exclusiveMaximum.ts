import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const exclusiveMaximum =
  (max: number): Validator<number> =>
  (input: number, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('exclusiveMaximum', path)
    if (isNil(severity)) {
      return []
    }
    if (input >= max) {
      return [
        {
          message: config.message('exclusiveMaximum', path, {
            type: 'exclusiveMaximum',
            input,
            hint: max,
          }),
          path,
          severity,
        },
      ]
    }
    return []
  }
