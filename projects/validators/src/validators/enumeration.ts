import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

/**
 * @deprecated Use union instead
 */
export const enumeration =
  <T extends string | number | boolean>(values: T[]): Validator<T> =>
  (input: T, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('enumeration', path)!
    if (isNil(severity)) {
      return []
    }
    if (values.indexOf(input) < 0) {
      return [
        {
          message: config.message('enumeration', path, { expected: values }),
          path,
          severity,
        },
      ]
    }
    return []
  }
