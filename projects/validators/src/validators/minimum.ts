import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const minimum =
  (min: number): Validator<number> =>
  (input: number, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('minimum', path)
    if (isNil(severity)) {
      return []
    }
    if (input < min) {
      return [
        {
          message: config.message('minimum', path, {
            type: 'minimum',
            hint: min,
            input,
          }),
          path,
          severity,
        },
      ]
    }
    return []
  }
