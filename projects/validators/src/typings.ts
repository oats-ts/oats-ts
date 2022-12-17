export type Severity = 'error' | 'warning' | 'info'

export type Issue = {
  severity: Severity
  path: string
  message: string
}
