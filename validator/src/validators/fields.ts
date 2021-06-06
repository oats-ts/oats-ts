import { Issue, IssueType, Severity, Validator, ValidatorConfig } from '../typings'

export const fields =
  <T extends object>(validators: Record<keyof T, Validator<any>>): Validator<T> =>
  (input: object, { path, append }: ValidatorConfig): Issue[] => {
    const keys = Object.keys(input)
    const expectedKeys = Object.keys(validators)
    const extraKeys: string[] = keys.filter((key) => expectedKeys.indexOf(key) < 0)
    const issues: Issue[] = []

    for (let i = 0; i < expectedKeys.length; i += 1) {
      const key = expectedKeys[i]
      const value = (input as any)[key]
      const validator = (validators as any)[key]
      issues.push(
        ...validator(value, {
          path: append(path, key),
          append,
        }),
      )
    }

    // TODO allow extra key validation
    if (extraKeys.length > 0 && !!false) {
      issues.push(
        ...extraKeys.map(
          (key): Issue => ({
            type: IssueType.EXTRA_KEY,
            severity: Severity.ERROR,
            message: `should not have key "${key}"`,
            path: append(path, key),
          }),
        ),
      )
    }

    return issues
  }
