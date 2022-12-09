import { Issue } from './typings'

const defaultMatcher = (input: Issue) => input.severity !== 'error'

export function isOk(issues: Issue[], matcher: (input: Issue) => boolean = defaultMatcher): boolean {
  return issues.every((issue) => matcher(issue))
}
