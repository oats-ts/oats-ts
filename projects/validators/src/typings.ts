export type Severity = 'error' | 'warning' | 'info'

export type Issue = {
  severity: Severity
  /** @deprecated Use with caution, planned to be refactored in the future. */
  type: string
  path: string
  message: string
}

export type ValidatorConfig = {
  severity: (type: string) => Severity | undefined
  append: (path: string, ...segments: (string | number)[]) => string
}

export type Validator<T> = (input: T, path: string, config: ValidatorConfig) => Issue[]

export type PartialValidator<T> = (input: T, path?: string, config?: Partial<ValidatorConfig>) => Issue[]
