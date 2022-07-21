export type Severity = 'error' | 'warning' | 'info'

export type Issue = {
  severity: Severity
  type?: string
  path: string
  message: string
}

export type ValidatorConfig = {
  severity: (type: string) => Severity | undefined
  append: (path: string, ...segments: (string | number)[]) => string
}

export type ValidatorFn<T> = (input: T, path: string, config: ValidatorConfig) => Issue[]

export type Validator<T, Type extends string = string> = {
  (input: T, path: string, config: ValidatorConfig): Issue[]
  type: Type
}

export type PartialValidator<T> = (input: T, path?: string, config?: Partial<ValidatorConfig>) => Issue[]
