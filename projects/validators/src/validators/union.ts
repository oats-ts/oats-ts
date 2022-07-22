import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

/** TODO better way of representing the issues. */
export const union =
  (validators: Record<string, Validator<any>>): Validator<any> =>
  (input: any, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('union', path)
    if (isNil(severity)) {
      return []
    }

    const expected = Object.keys(validators)

    for (let i = 0; i < expected.length; i += 1) {
      const key = expected[i]
      const validator = validators[key]
      const children = validator(input, path, config)
      if (children.length === 0) {
        return []
      }
    }

    return [
      {
        message: config.message('union', path, { expected }), //`should be one of [${keys.join(', ')}]`,
        path: path,
        severity,
      },
    ]
  }
