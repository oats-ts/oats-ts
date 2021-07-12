import { Issue, Severity } from '@oats-ts/validators'

const SeverityMap = new Map<Severity, number>([
  ['error', 0],
  ['warning', 1],
  ['info', 2],
])

export function issueComparator(a: Issue, b: Issue): number {
  return SeverityMap.get(a.severity) - SeverityMap.get(b.severity)
}

export function severityOf(issues: Issue[]): Severity {
  return issues
    .map((issue) => issue.severity)
    .reduce(
      (maxSeverity, severity) => (SeverityMap.get(severity) < SeverityMap.get(maxSeverity) ? severity : maxSeverity),
      'info',
    )
}
