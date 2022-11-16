import { Issue, Severity } from './typings'

const SeverityMap: Record<Severity, number> = {
  error: 0,
  warning: 1,
  info: 2,
}

export function severityComparator(a: Issue, b: Issue): number {
  if (a.severity === b.severity) {
    return 0
  }
  return (SeverityMap[a.severity] ?? -1) - (SeverityMap[b.severity] ?? -1)
}
