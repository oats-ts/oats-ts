import { Issue, Validator, ValidatorConfig } from '../typings'

export const itemsOf =
  (validate: Validator<any>): Validator<any[]> =>
  (input: any[], config: ValidatorConfig) => {
    const issues: Issue[] = []
    for (let i = 0; i < input.length; i += 1) {
      issues.push(
        ...validate(input[i], {
          ...config,
          path: config.append(config.path, i.toString()),
        }),
      )
    }
    return issues
  }
