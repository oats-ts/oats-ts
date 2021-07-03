import { Issue, Validator, ValidatorConfig } from '../typings'

export const merge =
  <T>(...validators: Validator<T>[]): Validator<T> =>
  (input: T, config?: Partial<ValidatorConfig>) => {
    const issues: Issue[] = []
    for (let i = 0; i < validators.length; i += 1) {
      const partialIssues = validators[i](input, config)
      if (partialIssues.length > 0) {
        issues.push(...partialIssues)
      }
    }
    return issues
  }
