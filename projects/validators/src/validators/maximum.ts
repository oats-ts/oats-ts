import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const maximum =
  (max: number): Validator<number> =>
  (input: number, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('maximum', path)
    if (isNil(severity)) {
      return []
    }
    if (input > max) {
      return [
        {
          message: config.message('maximum', path, {
            type: 'maximum',
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
