import { Issue, ShapeInput, TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const shape =
  <T extends Record<string, any>>(validators: ShapeInput<T>): Validator<object> =>
  (input: object, path: string, config: TypedValidatorConfig) => {
    const severity = config.severity('shape', path)
    if (isNil(severity)) {
      return []
    }
    const expectedKeys = Object.keys(validators)
    const issues: Issue[] = []

    for (let i = 0; i < expectedKeys.length; i += 1) {
      const key = expectedKeys[i]
      const value = (input as any)[key]
      const validator = (validators as any)[key]
      const newIssues = validator(value, config.append(path, key), config)
      issues.push(...newIssues)
    }

    return issues
  }
