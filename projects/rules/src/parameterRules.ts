export type HeaderParameterRule<T extends StructuralParameterRule = StructuralParameterRule> = {
  location: 'header'
  style: 'simple'
  required: boolean
  explode: boolean
  structure: T
}

export type PathParameterRule<T extends StructuralParameterRule = StructuralParameterRule> = {
  location: 'path'
  style: 'simple' | 'label' | 'matrix'
  required: true
  explode: boolean
  structure: T
}

export type QueryParameterRule<T extends StructuralParameterRule = StructuralParameterRule> = {
  location: 'query'
  style: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
  required: boolean
  explode: boolean
  structure: T
}

export type CookieParameterRule<T extends StructuralParameterRule = StructuralParameterRule> = {
  location: 'cookie'
  style: 'form'
  required: boolean
  explode: boolean
  structure: T
}

export type ParameterRule<T extends StructuralParameterRule = StructuralParameterRule> =
  | QueryParameterRule<T>
  | PathParameterRule<T>
  | CookieParameterRule<T>
  | HeaderParameterRule<T>

export type PrimitiveParameterRule = { type: 'primitive'; value: ValueParameterRule }
export type ObjectParameterRule = { type: 'object'; properties: Record<string, ValueParameterRule> }
export type ArrayParameterRule = { type: 'array'; items: ValueParameterRule }
export type MimeTypeParameterRule = { type: 'mime-type'; mimeType: string }

export type StructuralParameterRule =
  | PrimitiveParameterRule
  | ObjectParameterRule
  | ArrayParameterRule
  | MimeTypeParameterRule

export type StringParameterRule = { type: 'string' }
export type NumberParameterRule = { type: 'number' }
export type BooleanParameterRule = { type: 'boolean' }
export type OptionalParameterRule = { type: 'optional'; value: ValueParameterRule }
export type UnionParameterRule = { type: 'union'; alternatives: ValueParameterRule[] }

export type ValueParameterRule =
  | StringParameterRule
  | NumberParameterRule
  | BooleanParameterRule
  | OptionalParameterRule
  | UnionParameterRule
