import { Issue, Validator, ValidatorConfig } from '../typings'

export const tuple =
  (...validators: Validator<any>[]): Validator<any> =>
  (input: any[], path: string, config: ValidatorConfig) => {
    const issues: Issue[] = []
    for (let i = 0; i < validators.length; i += 1) {
      const validator = validators[i]
      const newIssues = validator(input[i], config.append(path, i), config)
      issues.push(...newIssues)
    }
    return issues
  }
