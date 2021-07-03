export enum Severity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export enum IssueType {
  TYPE = 'openapi/type',
  ENUM = 'enum',
  LITERAL = 'literal',
  LENGTH = 'length',
  UNION = 'union',
  KEY = 'key',
}

export type Issue = {
  severity: string
  type: string
  path: string
  message: string
}

export type ValidatorConfig = {
  path: string
  severities?: Record<string, string>
  append(path: string, ...segments: string[]): string
}

export type Validator<T> = (input: T, config?: Partial<ValidatorConfig>) => Issue[]
