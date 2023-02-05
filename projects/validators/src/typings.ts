export type Severity = 'error' | 'warning' | 'info'

export type Issue = {
  severity: Severity
  path: string
  message: string
}

export type Validator = {
  validate(input: unknown, path?: string | undefined): Issue[]
}
