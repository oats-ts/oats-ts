import { Issue, TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const items =
  (validate: Validator<any>): Validator<any[]> =>
  (input: any[], path: string, config: TypedValidatorConfig) => {
    if (isNil(config.severity('items', path))) {
      return []
    }
    const issues: Issue[] = []
    for (let i = 0; i < input.length; i += 1) {
      issues.push(...validate(input[i], config.append(path, i), config))
    }
    return issues
  }
