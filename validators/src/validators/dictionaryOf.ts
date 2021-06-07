import { Issue, Validator, ValidatorConfig } from '../typings'

export const dictionaryOf =
  (validate: Validator<any>): Validator<object> =>
  (input: object, config: ValidatorConfig) => {
    const issues: Issue[] = []
    const keys = Object.keys(input)
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i]
      const newIssues = validate((input as any)[key], {
        ...config,
        path: config.append(config.path, key),
      })
      issues.push(...newIssues)
    }
    return issues
  }
