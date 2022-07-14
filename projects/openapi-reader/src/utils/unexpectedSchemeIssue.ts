import { Issue, IssueTypes } from '@oats-ts/validators'
import { SchemeConfig } from '../typings'

export function unexpectedSchemeIssue(path: string, scheme: string, config: SchemeConfig): Issue {
  const allowedSchemes: string[] = [
    ...(config.http ? ['http'] : []),
    ...(config.https ? ['https'] : []),
    ...(config.file ? ['file'] : []),
  ]
  const joinedSchemes = allowedSchemes.map((s) => `"${s}"`).join(', ')
  return {
    message: `unexpected URI scheme: "${scheme}" (expected one of ${joinedSchemes})`,
    path,
    severity: 'error',
    type: IssueTypes.other,
  }
}
