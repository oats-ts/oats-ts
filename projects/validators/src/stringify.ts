import { Issue } from './typings'

export function stringify(issue: Issue): string {
  return `[${issue.severity.toUpperCase()}] in "${issue.path}": ${issue.message}`
}
