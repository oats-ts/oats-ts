import { Issue, IssueType, Validator, ValidatorConfig } from '../typings'
import { getConfig, getSeverity, isNil } from '../utils'

const issueType: IssueType = 'extra-key'

export const shape =
  <T extends Record<string, any>>(
    validators: Record<keyof T, Validator<any>>,
    allowExtraFields = false,
  ): Validator<Record<string, any>> =>
  (input: object, config?: Partial<ValidatorConfig>) => {
    const cfg = getConfig(config)
    const keys = Object.keys(input)
    const expectedKeys = Object.keys(validators)
    const extraKeys: string[] = keys.filter((key) => expectedKeys.indexOf(key) < 0)
    const issues: Issue[] = []

    for (let i = 0; i < expectedKeys.length; i += 1) {
      const key = expectedKeys[i]
      const value = (input as any)[key]
      const validator = (validators as any)[key]
      const newIssues = validator(value, {
        ...cfg,
        path: cfg.append(cfg.path, key),
      })
      issues.push(...newIssues)
    }
    const severity = getSeverity(issueType, cfg)

    if (extraKeys.length > 0 && !isNil(severity) && !allowExtraFields) {
      issues.push(
        ...extraKeys.map(
          (key): Issue => ({
            type: issueType,
            message: `should not have key "${key}"`,
            path: cfg.append(cfg.path, key),
            severity,
          }),
        ),
      )
    }

    return issues
  }
