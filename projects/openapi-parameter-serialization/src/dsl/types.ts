export type Primitive = string | number | boolean
export type PrimitiveArray = ReadonlyArray<Primitive>
export type PrimitiveRecord = Record<string, Primitive>
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord

export type DslType = 'primitive' | 'array' | 'object'
export type DslLocation = 'query' | 'header' | 'path' | 'cookie'
export type DslStyle = 'matrix' | 'label' | 'form' | 'simple' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'

export type EnumDsl<T> = {
  type: 'enum'
  values: T[]
}

export type LiteralDsl<T> = {
  type: 'literal'
  value: T
}

export type ValidatorDsl<T> = LiteralDsl<T> | EnumDsl<T>

export type StringDsl<T extends Primitive = string> = {
  type: 'string'
  validator?: ValidatorDsl<T>
}

export type NumberDsl<T extends Primitive = number> = {
  type: 'number'
  validator?: ValidatorDsl<T>
}

export type BooleanDsl<T extends Primitive = boolean> = {
  type: 'boolean'
  validator?: ValidatorDsl<T>
}

export type ValueDsl<T extends Primitive> = StringDsl<T> | NumberDsl<T> | BooleanDsl<T>

export type Dsl<T extends DslType, L extends DslLocation, S extends DslStyle> = {
  type: T
  location: L
  style: S
  required: boolean
  explode: boolean
}

export type PrimitiveDsl<T extends Primitive, L extends DslLocation, S extends DslStyle> = Dsl<'primitive', L, S> & {
  value: ValueDsl<T>
}

export type ArrayDsl<T extends PrimitiveArray, L extends DslLocation, S extends DslStyle> = Dsl<'array', L, S> & {
  items: ValueDsl<T[number]>
}

export type PropertiesDsl<T extends PrimitiveRecord> = { [P in keyof T]: ValueDsl<T[P]> }

export type ObjectDsl<T extends PrimitiveRecord, L extends DslLocation, S extends DslStyle> = Dsl<'object', L, S> & {
  properties: PropertiesDsl<T>
}

export type QueryDsl<T extends DslType> = Dsl<T, 'query', 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'>
export type PathDsl<T extends DslType> = Dsl<T, 'path', 'simple'>
export type HeaderDsl<T extends DslType> = Dsl<T, 'header', 'simple' | 'label' | 'matrix'>
export type CookieDsl<T extends DslType> = Dsl<T, 'cookie', 'form'>

export type DslConfig = {
  required: boolean
  explode: boolean
}
