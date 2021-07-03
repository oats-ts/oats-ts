import { Severity, Validator } from './typings'

export function validate<T = any>(input: T, validator: Validator<T>): void {
  const issues = validator(input)
  if (issues.length > 0 && issues.some((issue) => issue.severity === Severity.ERROR)) {
    const message = issues.map((issue) => `[${issue.severity}] ${issue.message} at ${issue.path}`).join('\n')
    throw new Error(message)
  }
}
