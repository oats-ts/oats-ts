import { failure, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'

export function sanitizePath(path: string): Try<string> {
  return failure([
    {
      path: 'path',
      severity: 'error',
      type: IssueTypes.other,
      message: `"${path}" should be a valid URI`,
    },
  ])
}
