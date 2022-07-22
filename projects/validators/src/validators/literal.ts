import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const literal =
  (value: string | number | boolean | null | undefined): Validator<any> =>
  (input: any, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('literal', path)
    if (isNil(severity)) {
      return []
    }
    if (value !== input) {
      return [
        {
          message: config.message('literal', path, { expected: value }),
          path,
          severity,
        },
      ]
    }
    return []
  }
