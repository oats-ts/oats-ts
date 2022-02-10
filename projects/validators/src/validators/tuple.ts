import { Issue, IssueType, Validator, ValidatorConfig } from '../typings'
import { getConfig, getSeverity, isNil } from '../utils'

const issueType: IssueType = 'length'

export const tuple =
  (...validators: Validator<any>[]): Validator<any> =>
  (input: any[], config?: Partial<ValidatorConfig>) => {
    const cfg = getConfig(config)
    const severity = getSeverity(issueType, cfg)
    if (isNil(severity)) {
      return []
    }
    const issues: Issue[] = []
    for (let i = 0; i < validators.length; i += 1) {
      const validator = validators[i]
      const newIssues = validator(input[i], {
        ...cfg,
        path: cfg.append(cfg.path, i.toString()),
      })
      issues.push(...newIssues)
    }
    return issues
  }
