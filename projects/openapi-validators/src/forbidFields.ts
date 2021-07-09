import { Issue, Severity, Validator, ValidatorConfig } from '@oats-ts/validators'

export const forbidFields =
  <T>(
    fields: (keyof T)[],
    message: (field: string) => string = (field) => `should not have field "${field}"`,
    severity: Severity = 'error',
  ): Validator<object> =>
  (input: object, config?: Partial<ValidatorConfig>): Issue[] => {
    const issues: Issue[] = []
    for (let i = 0; i < fields.length; i += 1) {
      const fieldName = fields[i] as string
      const value = (input as any)[fieldName]
      if (value !== null && value !== undefined) {
        issues.push({
          message: message(fieldName),
          path: config.append(config.path, fieldName),
          severity,
          type: 'other',
        })
      }
    }
    return issues
  }