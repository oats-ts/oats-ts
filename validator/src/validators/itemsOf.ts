import { Issue, Validator, ValidatorConfig } from '../typings'

export const itemsOf =
  (validate: Validator<any>): Validator<any[]> =>
  (input: any[], { path, append }: ValidatorConfig): Issue[] => {
    const issues: Issue[] = []
    for (let i = 0; i < input.length; i += 1) {
      issues.push(
        ...validate(input[i], {
          path: append(path, i.toString()),
          append,
        }),
      )
    }
    return issues
  }
