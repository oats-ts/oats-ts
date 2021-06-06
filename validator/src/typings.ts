export enum ValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  NIL = 'nil',
  OBJECT = 'object',
  ARRAY = 'array',
}

export enum Severity {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

export enum IssueType {
  TYPE = 'type',
  ENUM = 'enum',
  LENGTH = 'length',
  UNION = 'union',
  EXTRA_KEY = 'extra-key',
}

export type Issue = {
  severity?: Severity | string
  type?: IssueType | string
  path: string
  message: string
}

export type ValidatorConfig = {
  path: string
  append(path: string, ...segments: string[]): string
}

export type Validator<T> = (input: T, config: ValidatorConfig) => Issue[]
