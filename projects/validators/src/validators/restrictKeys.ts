import { Issue, TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const restrictKeys =
  <T extends Record<string, any>>(expectedKeys: (keyof T)[]): Validator<object> =>
  (input: object, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('restrictKeys', path)
    if (isNil(severity)) {
      return []
    }
    const keys = Object.keys(input)
    const extraKeys: string[] = keys.filter((key) => expectedKeys.indexOf(key) < 0)
    if (extraKeys.length > 0) {
      return extraKeys.map(
        (key): Issue => ({
          message: config.message('restrictKeys', path, { key }),
          path: config.append(path, key),
          severity,
        }),
      )
    }
    return []
  }
