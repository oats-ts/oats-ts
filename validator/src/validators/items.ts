import { Issue, IssueType, Validator, ValidatorConfig } from '../typings'

export const items =
  (...validators: Validator<any>[]): Validator<any> =>
  (input: any[], { path, append }: ValidatorConfig): Issue[] => {
    if (input.length !== validators.length) {
      return [
        {
          type: IssueType.LENGTH,
          message: `should have ${validators.length} items`,
          path,
        },
      ]
    }
    const issues: Issue[] = []
    for (let i = 0; i < input.length; i += 1) {
      issues.push(
        ...validators[i](input[i], {
          path: append(path, i.toString()),
          append,
        }),
      )
    }
    return issues
  }
