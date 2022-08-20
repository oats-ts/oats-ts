export type Severity = 'error' | 'warning' | 'info'

export type ValueType = 'array' | 'boolean' | 'nil' | 'number' | 'object' | 'string'

export type ValidatorType =
  | ValueType
  | 'union'
  | 'tuple'
  | 'record'
  | 'optional'
  | 'minLength'
  | 'literal'
  | 'lazy'
  | 'items'
  | 'enumeration'
  | 'combine'
  | 'any'
  | 'shape'
  | 'restrictKeys'

export type Issue = {
  severity: Severity
  path: string
  message: string
}

export type ShapeInput<T> = {
  [P in keyof T]?: Validator<any>
}

export type ValidatorConfig<T extends string = any, D = any> = {
  severity: (type: T, path: string) => Severity | undefined
  message: (type: T, path: string, data?: D) => string
  append: (path: string, ...segments: (string | number)[]) => string
}

export type UnionMessageData = {
  expected: string[]
}

export type EnumerationMessageData = {
  expected: (string | number | boolean)[]
}

export type LiteralMessageData = {
  expected: string | number | boolean | null | undefined
}

export type MinLengthMessageData = {
  expected: number
}

export type RestrictKeysData = {
  key: string
}

export type ValidatorData =
  | UnionMessageData
  | EnumerationMessageData
  | LiteralMessageData
  | MinLengthMessageData
  | RestrictKeysData

export type TypedValidatorConfig = ValidatorConfig<ValidatorType, ValidatorData>

export type Validator<T> = {
  (input: T, path: string, config: ValidatorConfig): Issue[]
}

export type ConfiguredValidator<T> = (input: T, path?: string, config?: ValidatorConfig) => Issue[]
