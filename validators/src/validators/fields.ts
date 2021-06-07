import { Issue, IssueType, Validator, ValidatorConfig } from '../typings'
import { getSeverity, isNil } from '../utils'

export const fields =
  <T extends object>(validators: Record<keyof T, Validator<any>>, allowExtraFields = false): Validator<T> =>
  (input: object, config: ValidatorConfig) => {
    const keys = Object.keys(input)
    const expectedKeys = Object.keys(validators)
    const extraKeys: string[] = keys.filter((key) => expectedKeys.indexOf(key) < 0)
    const issues: Issue[] = []

    for (let i = 0; i < expectedKeys.length; i += 1) {
      const key = expectedKeys[i]
      const value = (input as any)[key]
      const validator = (validators as any)[key]
      const newIssues = validator(value, {
        ...config,
        path: config.append(config.path, key),
      })
      issues.push(...newIssues)
    }

    const severity = getSeverity(IssueType.KEY, config)

    if (extraKeys.length > 0 && !isNil(severity) && !allowExtraFields) {
      issues.push(
        ...extraKeys.map(
          (key): Issue => ({
            type: IssueType.KEY,
            message: `should not have key "${key}"`,
            path: config.append(config.path, key),
            severity,
          }),
        ),
      )
    }

    return issues
  }
