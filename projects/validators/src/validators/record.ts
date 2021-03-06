import { Issue, TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const record =
  (keys: Validator<string>, values: Validator<any>): Validator<object> =>
  (input: object, path: string, config: TypedValidatorConfig) => {
    if (isNil(config.severity('record', path))) {
      return []
    }
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
