import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const multipleOf =
  (multiple: number): Validator<number> =>
  (input: number, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('multipleOf', path)
    if (isNil(severity)) {
      return []
    }
    if (input % multiple !== 0) {
      return [
        {
          message: config.message('multipleOf', path, {
            type: 'multipleOf',
            hint: multiple,
            input,
          }),
          path,
          severity,
        },
      ]
    }
    return []
  }
