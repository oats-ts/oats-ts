import { Issue, IssueType, FullValidator, ValidatorConfig } from '../typings'
import { getSeverity, isNil } from '../utils'

const issueType: IssueType = 'length'

export const tuple =
  (...validators: FullValidator<any>[]): FullValidator<any> =>
  (input: any[], path: string, config: ValidatorConfig) => {
    const severity = getSeverity(issueType, config)
    if (isNil(severity)) {
      return []
    }
    const issues: Issue[] = []
    for (let i = 0; i < validators.length; i += 1) {
      const validator = validators[i]
      const newIssues = validator(input[i], config.append(path, i), config)
      issues.push(...newIssues)
    }
    return issues
  }
