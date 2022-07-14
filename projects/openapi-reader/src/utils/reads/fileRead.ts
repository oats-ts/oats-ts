import { failure, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'

export async function fileRead(uri: string): Promise<Try<string>> {
  return failure([
    {
      message: `Cannot read file (attempted "${uri}")`,
      path: uri,
      severity: 'error',
      type: IssueTypes.other,
    },
  ])
}
