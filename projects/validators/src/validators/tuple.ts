import { Issue, TypedValidatorConfig, Validator, ValidatorConfig } from '../typings'
import { isNil } from '../utils'

export const tuple =
  (...validators: Validator<any>[]): Validator<any> =>
  (input: any[], path: string, config: TypedValidatorConfig) => {
    if (isNil(config.severity('tuple', path))) {
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
