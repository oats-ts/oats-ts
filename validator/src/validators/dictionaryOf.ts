import { Issue, Validator, ValidatorConfig } from '../typings'

export const dictionaryOf =
  (validate: Validator<any>): Validator<object> =>
  (input: object, { path, append }: ValidatorConfig): Issue[] => {
    const issues: Issue[] = []
    const keys = Object.keys(input)
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i]
      issues.push(
        ...validate((input as any)[key], {
          path: append(path, key),
          append,
        }),
      )
    }
    return issues
  }
