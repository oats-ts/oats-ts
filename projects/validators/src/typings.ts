export type Severity = 'error' | 'warning' | 'info'

export type ValueType = 'array' | 'boolean' | 'nil' | 'number' | 'integer' | 'object' | 'string'

export type ValidatorType =
  | ValueType
  | 'union'
  | 'tuple'
  | 'record'
  | 'optional'
  | 'literal'
  | 'lazy'
  | 'items'
  | 'enumeration'
  | 'combine'
  | 'any'
  | 'shape'
  | 'restrictKey'
  | 'minLength'
  | 'maxLength'
  | 'maximum'
  | 'minimum'
  | 'exclusiveMinimum'
  | 'exclusiveMaximum'
  | 'multipleOf'
  | 'pattern'

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

export type GenericValidatorData<Type extends string, Value, Hint> = {
  type: Type
  hint: Hint
  input: Value
}

export type PatternMessageData = GenericValidatorData<'pattern', string, RegExp>
export type UnionMessageData = GenericValidatorData<'union', any, string[]>
export type EnumerationMessageData = GenericValidatorData<'enumeration', any, (string | number | boolean)[]>
export type LiteralMessageData = GenericValidatorData<'literal', any, string | number | boolean | null | undefined>
export type MinLengthMessageData = GenericValidatorData<'minLength', { length: number }, number>
export type MaxLengthMessageData = GenericValidatorData<'maxLength', { length: number }, number>
export type MinimumMessageData = GenericValidatorData<'minimum', number, number>
export type MaximumMessageData = GenericValidatorData<'maximum', number, number>
export type ExclusiveMinimumMessageData = GenericValidatorData<'exclusiveMinimum', number, number>
export type ExclusiveMaximumMessageData = GenericValidatorData<'exclusiveMaximum', number, number>
export type MultipleOfMessageData = GenericValidatorData<'multipleOf', number, number>
export type RestrictKeyData = GenericValidatorData<'restrictKey', Record<string, any>, string>

export type ValidatorData =
  | UnionMessageData
  | EnumerationMessageData
  | LiteralMessageData
  | RestrictKeyData
  | MinLengthMessageData
  | MaxLengthMessageData
  | PatternMessageData
  | MinimumMessageData
  | MaximumMessageData
  | ExclusiveMaximumMessageData
  | ExclusiveMinimumMessageData
  | MultipleOfMessageData

export type TypedValidatorConfig = ValidatorConfig<ValidatorType, ValidatorData>

export type Validator<T> = {
  (input: T, path: string, config: ValidatorConfig): Issue[]
}

export type ConfiguredValidator<T> = (input: T, path?: string, config?: ValidatorConfig) => Issue[]
