import { Issue, Severity } from '@oats-ts/validators'

const SeverityMap: Record<Severity, number> = {
  error: 0,
  warning: 1,
  info: 2,
}

export function issueComparator(a: Issue, b: Issue): number {
  return (SeverityMap[a.severity] ?? -1) - (SeverityMap[b.severity] ?? -1)
}

export function severityOf(issues: Issue[]): Severity {
  return issues
    .map((issue) => issue.severity)
    .reduce(
      (maxSeverity, severity) =>
        (SeverityMap[severity] ?? -1) < (SeverityMap[maxSeverity] ?? -1) ? severity : maxSeverity,
      'info',
    )
}
