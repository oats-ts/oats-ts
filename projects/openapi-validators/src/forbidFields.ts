import { Issue, Validator, ValidatorConfig } from '@oats-ts/validators'

export const forbidFields =
  <T>(fields: (keyof T)[]): Validator<object> =>
  (input: object, config?: Partial<ValidatorConfig>): Issue[] => {
    const issues: Issue[] = []
    for (let i = 0; i < fields.length; i += 1) {
      const fieldName = fields[i]
      const value = (input as any)[fieldName]
      if (value !== null && value !== undefined) {
        issues.push({
          message: `should not have field "${fieldName}"`,
          path: config.append(config.path, fieldName as string),
          severity: 'error',
          type: 'other',
        })
      }
    }
    return issues
  }
