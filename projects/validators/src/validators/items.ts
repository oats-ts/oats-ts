import { Issue, FullValidator, ValidatorConfig } from '../typings'

export const items =
  (validate: FullValidator<any>): FullValidator<any[]> =>
  (input: any[], path: string, config: ValidatorConfig) => {
    const issues: Issue[] = []
    for (let i = 0; i < input.length; i += 1) {
      issues.push(...validate(input[i], config.append(path, i), config))
    }
    return issues
  }
