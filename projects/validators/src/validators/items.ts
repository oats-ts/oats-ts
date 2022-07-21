import { typed } from '../typed'
import { Issue, Validator, ValidatorConfig } from '../typings'

const Type = 'items' as const

export const items = (validate: Validator<any>) =>
  typed((input: any[], path: string, config: ValidatorConfig) => {
    const issues: Issue[] = []
    for (let i = 0; i < input.length; i += 1) {
      issues.push(...validate(input[i], config.append(path, i), config))
    }
    return issues
  }, Type)
