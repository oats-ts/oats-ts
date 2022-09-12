import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const pattern =
  (regex: RegExp): Validator<string> =>
  (input: string, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('pattern', path)
    if (isNil(severity)) {
      return []
    }
    regex.lastIndex = 0
    if (!regex.test(input)) {
      return [
        {
          message: config.message('pattern', path, {
            type: 'pattern',
            hint: regex,
            input,
          }),
          path,
          severity,
        },
      ]
    }
    return []
  }
