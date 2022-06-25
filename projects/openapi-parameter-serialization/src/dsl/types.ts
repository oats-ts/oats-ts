import { Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'

export type Primitive = string | number | boolean | undefined
export type PrimitiveArray = ReadonlyArray<Primitive> | undefined
export type PrimitiveRecord = Record<string, Primitive> | undefined
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord
export type ParameterType = Record<string, ParameterValue>

export type DslType = 'primitive' | 'array' | 'object'
export type DslLocation = 'query' | 'header' | 'path' | 'cookie'
export type DslStyle = 'matrix' | 'label' | 'form' | 'simple' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'

export type QueryStyle = 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
export type PathStyle = 'simple' | 'label' | 'matrix'
export type HeaderStyle = 'simple'
export type CookieStyle = 'form'

export type EnumDsl = {
  type: 'enum'
  values: any[]
}

export type LiteralDsl = {
  type: 'literal'
  value: any
}

export type OptionalDsl = {
  type: 'optional'
  dsl: ValueDsl
}

export type StringDsl = {
  type: 'string'
  dsl?: ValueDsl
}

export type NumberDsl = {
  type: 'number'
  dsl?: ValueDsl
}

export type BooleanDsl = {
  type: 'boolean'
  dsl?: ValueDsl
}

export type ValueDsl = StringDsl | NumberDsl | BooleanDsl | EnumDsl | OptionalDsl | LiteralDsl

export type DslCommon<D extends DslType, L extends DslLocation, S extends DslStyle> = {
  type: D
  location: L
  style: S
  required: boolean
  explode: boolean
}

export type PrimitiveDsl<L extends DslLocation, S extends DslStyle> = DslCommon<'primitive', L, S> & {
  value: ValueDsl
}

export type ArrayDsl<L extends DslLocation, S extends DslStyle> = DslCommon<'array', L, S> & {
  items: ValueDsl
}

export type PropertiesDsl = Record<string, ValueDsl>

export type ObjectDsl<L extends DslLocation, S extends DslStyle> = DslCommon<'object', L, S> & {
  properties: PropertiesDsl
}

export type Dsl<L extends DslLocation, S extends DslStyle> = PrimitiveDsl<L, S> | ArrayDsl<L, S> | ObjectDsl<L, S>

export type DslRoot<T, L extends DslLocation, S extends DslStyle> = {
  [P in keyof T]: Dsl<L, S>
}

export type QueryDslRoot<T> = DslRoot<T, 'query', QueryStyle>

export type PathDslRoot<T> = DslRoot<T, 'path', PathStyle>

export type HeaderDslRoot<T> = DslRoot<T, 'header', HeaderStyle>

export type CookieDslRoot<T> = DslRoot<T, 'cookie', CookieStyle>

export type DslConfig = {
  required: boolean
  explode: boolean
}

export type RawHeaders = Record<string, string>
export type RawPathParams = Record<string, string>
export type RawQueryParams = Record<string, string[]>

export type ValueDeserializer<I extends Primitive, O extends Primitive = I> = (
  input: I,
  name: string,
  path: string,
  config: ValidatorConfig,
) => Try<O>

export type FieldValueDeserializers<T extends PrimitiveRecord> = {
  // TODO T[P] does not compile, why?
  [P in keyof Exclude<T, undefined>]: ValueDeserializer<string, any>
}

export type Deserializer<I, O> = (input: I, name: string, path: string, config: ValidatorConfig) => Try<O>

export type Deserializers<I, O extends ParameterType> = { [P in keyof O]: Deserializer<I, O> }
