import { Issue, IssueType, Validator, ValidatorConfig } from '../typings'
import { getConfig, getSeverity, isNil } from '../utils'

export const tuple =
  (...validators: Validator<any>[]): Validator<any> =>
  (input: any[], config?: Partial<ValidatorConfig>) => {
    const cfg = getConfig(config)
    const severity = getSeverity(IssueType.LENGTH, cfg)
    if (isNil(severity)) {
      return []
    }
    if (input.length !== validators.length) {
      return [
        {
          type: IssueType.LENGTH,
          message: `should have ${validators.length} items`,
          path: cfg.path,
          severity,
        },
      ]
    }
    const issues: Issue[] = []
    for (let i = 0; i < input.length; i += 1) {
      const validator = validators[i]
      const newIssues = validator(input[i], {
        ...cfg,
        path: cfg.append(cfg.path, i.toString()),
      })
      issues.push(...newIssues)
    }
    return issues
  }
