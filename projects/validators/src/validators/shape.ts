import { IssueTypes } from '../issueTypes'
import { Issue, Validator, ValidatorConfig } from '../typings'
import { isNil } from '../utils'

export type ShapeInput<T> = {
  [P in keyof T]?: Validator<any>
}

export const shape =
  <T extends Record<string, any>>(
    validators: ShapeInput<T>,
    allowExtraFields = false,
  ): Validator<Record<string, any>> =>
  (input: object, path: string, config: ValidatorConfig) => {
    const keys = Object.keys(input)
    const expectedKeys = Object.keys(validators)
    const extraKeys: string[] = keys.filter((key) => expectedKeys.indexOf(key) < 0)
    const issues: Issue[] = []

    for (let i = 0; i < expectedKeys.length; i += 1) {
      const key = expectedKeys[i]
      const value = (input as any)[key]
      const validator = (validators as any)[key]
      const newIssues = validator(value, config.append(path, key), config)
      issues.push(...newIssues)
    }
    const severity = isNil(config.severity) ? 'error' : config.severity(IssueTypes.shape)

    if (extraKeys.length > 0 && !isNil(severity) && !allowExtraFields) {
      issues.push(
        ...extraKeys.map(
          (key): Issue => ({
            type: IssueTypes.shape,
            message: `should not have key "${key}"`,
            path: config.append(path, key),
            severity,
          }),
        ),
      )
    }

    return issues
  }
