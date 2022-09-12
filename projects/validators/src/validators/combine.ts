import { Issue, TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const combine =
  <T>(...validators: Validator<T>[]): Validator<T> =>
  (input: T, path: string, config: TypedValidatorConfig) => {
    if (isNil(config.severity('combine', path))) {
      return []
    }
    const issues: Issue[] = []
    for (let i = 0; i < validators.length; i += 1) {
      issues.push(...validators[i](input, path, config))
    }
    return issues
  }
