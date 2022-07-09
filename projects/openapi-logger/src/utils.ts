import { Issue, Severity } from '@oats-ts/validators'
import { red, green, blue, yellow } from 'chalk'

export const Icons = {
  x: red('✕'),
  s: green('✔'),
  w: yellow('!'),
  i: blue('i'),
}

export const Tab = '  '

export function severityIcon(severity: Severity): string {
  switch (severity) {
    case 'warning':
      return Icons.w
    case 'info':
      return Icons.i
    case 'error':
      return Icons.x
    default:
      return '?'
  }
}

export function issueToString(issue: Issue, indent: number = 1): string {
  return `${Tab.repeat(indent)}${severityIcon(issue.severity)} ${issue.message} at "${issue.path}"`
}

export function statusText(step: string, status: 'completed' | 'failed', name: string): string {
  return `${status === 'completed' ? Icons.s : Icons.x} ${step} step ${status} using "${blue(name)}"`
}

const SeverityMap: Record<Severity, number> = {
  error: 0,
  warning: 1,
  info: 2,
}

// TODO extract to a util maybe?
export function severityComparator(a: Issue, b: Issue): number {
  if (a.severity === b.severity) {
    return 0
  }
  return (SeverityMap[a.severity] ?? -1) - (SeverityMap[b.severity] ?? -1)
}
