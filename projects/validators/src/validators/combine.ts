import { Issue, Validator, ValidatorConfig } from '../typings'

export const combine =
  <T>(...validators: Validator<T>[]): Validator<T> =>
  (input: T, path: string, config: ValidatorConfig) => {
    const issues: Issue[] = []
    for (let i = 0; i < validators.length; i += 1) {
      const partialIssues = validators[i](input, path, config)
      if (partialIssues.length > 0) {
        issues.push(...partialIssues)
      }
    }
    return issues
  }
