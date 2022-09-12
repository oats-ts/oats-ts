import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const maxLength =
  (length: number): Validator<{ length: number }> =>
  (input: { length: number }, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('maxLength', path)
    if (isNil(severity)) {
      return []
    }
    if (input.length > length) {
      return [
        {
          message: config.message('maxLength', path, {
            type: 'maxLength',
            input,
            hint: length,
          }),
          path,
          severity,
        },
      ]
    }
    return []
  }
