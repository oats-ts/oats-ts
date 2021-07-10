import { Issue, Severity } from './typings'

const defaultNotOk: Severity[] = ['error']

export function isOk(issues: Issue[], notOk: Severity[] = defaultNotOk): boolean {
  return issues.every((issue) => notOk.indexOf(issue.severity) < 0)
}
