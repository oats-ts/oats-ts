import { Issue, FullValidator, ValidatorConfig } from '../typings'

export const record =
  (keys: FullValidator<string>, values: FullValidator<any>): FullValidator<object> =>
  (input: object, path: string, config: ValidatorConfig) => {
    const issues: Issue[] = []
    const objKeys = Object.keys(input)
    for (let i = 0; i < objKeys.length; i += 1) {
      const key = objKeys[i]
      const value = (input as any)[key]
      const itemPath = config.append(path, key)
      const keyIssues = keys(key, itemPath, config)
      const valueIssues = values(value, itemPath, config)
      issues.push(...keyIssues, ...valueIssues)
    }
    return issues
  }
