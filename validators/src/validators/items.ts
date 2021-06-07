import { Issue, IssueType, Validator, ValidatorConfig } from '../typings'
import { getSeverity, isNil } from '../utils'

export const items =
  (...validators: Validator<any>[]): Validator<any> =>
  (input: any[], config: ValidatorConfig) => {
    const severity = getSeverity(IssueType.LENGTH, config)
    if (!isNil(severity) && input.length !== validators.length) {
      return [
        {
          type: IssueType.LENGTH,
          message: `should have ${validators.length} items`,
          path: config.path,
          severity,
        },
      ]
    }
    const issues: Issue[] = []
    for (let i = 0; i < input.length; i += 1) {
      const validator = validators[i]
      const newIssues = validator(input[i], {
        ...config,
        path: config.append(config.path, i.toString()),
      })
      issues.push(...newIssues)
    }
    return issues
  }
