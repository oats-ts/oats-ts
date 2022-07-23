import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const minLength =
  (length: number): Validator<{ length: number }> =>
  (input: { length: number }, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('minLength', path)
    if (isNil(severity)) {
      return []
    }
    if (input.length < length) {
      return [
        {
          message: config.message('minLength', path, { expected: length }),
          path,
          severity,
        },
      ]
    }
    return []
  }
