export type Severity = 'error' | 'warning' | 'info'

export type IssueType =
  | 'array'
  | 'boolean'
  | 'nil'
  | 'number'
  | 'object'
  | 'string'
  | 'enum'
  | 'literal'
  | 'length'
  | 'union'
  | 'extra-key'

export type Issue<Type = string> = {
  severity: Severity
  type: Type
  path: string
  message: string
}

export type ValidatorConfig = {
  severities?: Record<string, Severity>
  append(path: string, ...segments: (string | number)[]): string
}

export type Validator<T> = (input: T, path: string, config: ValidatorConfig) => Issue[]

export type PartialValidator<T> = (input: T, path?: string, config?: Partial<ValidatorConfig>) => Issue[]
