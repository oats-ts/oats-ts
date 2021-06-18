import { Issue, Validator, ValidatorConfig } from '../typings'
import { getConfig } from '../utils'

export const record =
  (keys: Validator<string>, values: Validator<any>): Validator<object> =>
  (input: object, config?: Partial<ValidatorConfig>) => {
    const cfg = getConfig(config)
    const issues: Issue[] = []
    const objKeys = Object.keys(input)
    for (let i = 0; i < objKeys.length; i += 1) {
      const key = objKeys[i]
      const value = (input as any)[key]
      const path = cfg.append(cfg.path, key)
      const keyIssues = keys(key, {
        ...cfg,
        path,
      })
      const valueIssues = values(value, {
        ...cfg,
        path,
      })
      issues.push(...keyIssues, ...valueIssues)
    }
    return issues
  }
