import { stringify } from './stringify'
import { Validator } from './typings'

export function validate<T = any>(input: T, validator: Validator<T>): void {
  const issues = validator(input)
  if (issues.length > 0 && issues.some((issue) => issue.severity === 'error')) {
    const message = issues.map(stringify).join('\n')
    throw new Error(message)
  }
}
