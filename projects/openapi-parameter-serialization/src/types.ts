import { Cookies } from '@oats-ts/openapi-http'
import { Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'

export type Primitive = string | number | boolean | undefined
export type PrimitiveArray = ReadonlyArray<Primitive> | undefined
export type PrimitiveRecord = Record<string, Primitive> | undefined
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord
export type ParameterType = Record<string, ParameterValue>
export type CookieParameterType = Record<string, Primitive>

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

export type Transform<I, O> = (input: I, name: string, path: string, config: ValidatorConfig) => Try<O>

export type ValueDeserializer<I extends Primitive, O extends Primitive = I> = Transform<I | undefined, O>

export type FieldValueDeserializers<T extends PrimitiveRecord> = {
  // TODO T[P] does not compile, why?
  [P in keyof Exclude<T, undefined>]: ValueDeserializer<string, any>
}

export type Deserializer<I, O extends ParameterType> = (input: I, path?: string, config?: ValidatorConfig) => Try<O>
export type Serializer<I extends ParameterType, O> = (input: I, path?: string, config?: ValidatorConfig) => Try<O>

// Query typings
export type QuerySerializer<T extends ParameterType> = Serializer<T, string | undefined>
export type QueryDeserializer<T extends ParameterType> = Deserializer<string, T>
export type QueryParameterSerializer<T extends ParameterValue> = Transform<T, string[]>
export type QueryParameterDeserializer<T extends ParameterValue> = Transform<RawQueryParams, T>
export type QuerySerializers<T extends ParameterType> = {
  [P in keyof T]: QueryParameterSerializer<T[P]>
}
export type QueryDeserializers<T extends ParameterType> = {
  [P in keyof T]: QueryParameterDeserializer<T[P]>
}

// Path typings
export type PathSerializer<T extends ParameterType> = Serializer<T, string>
export type PathDeserializer<T extends ParameterType> = Deserializer<string, T>
export type PathParameterSerializer<T extends ParameterValue> = Transform<T, string>
export type PathParameterDeserializer<T extends ParameterValue> = Transform<RawHeaders, T>
export type PathSerializers<T extends ParameterType> = {
  [P in keyof T]: PathParameterSerializer<T[P]>
}
export type PathDeserializers<T extends ParameterType> = {
  [P in keyof T]: PathParameterDeserializer<T[P]>
}

// Header typings
export type HeaderSerializer<T extends ParameterType> = Serializer<T, RawHeaders>
export type HeaderDeserializer<T extends ParameterType> = Deserializer<RawHeaders, T>
export type HeaderParameterSerializer<T extends ParameterValue> = Transform<T, string | undefined>
export type HeaderParameterDeserializer<T extends ParameterValue> = Transform<RawHeaders, T>
export type HeaderSerializers<T extends ParameterType> = {
  [P in keyof T]: HeaderParameterSerializer<T[P]>
}
export type HeaderDeserializers<T extends ParameterType> = {
  [P in keyof T]: HeaderParameterDeserializer<T[P]>
}

// Cookie typings
export type SetCookieDeserializer<O extends CookieParameterType> = (
  input: string | undefined,
  path?: string,
  config?: ValidatorConfig,
) => Try<Cookies<O>>

export type SetCookieSerializer<I extends CookieParameterType> = (
  input: Cookies<I>,
  path?: string,
  config?: ValidatorConfig,
) => Try<Cookies<Record<string, string>>>

export type CookieDeserializer<O extends CookieParameterType> = (
  input: string | undefined,
  path?: string,
  config?: ValidatorConfig,
) => Try<O>

export type CookieSerializer<I extends CookieParameterType> = (
  input: I,
  path?: string,
  config?: ValidatorConfig,
) => Try<string>

export type CookieParameterSerializer<T extends ParameterValue> = Transform<T, string | undefined>
export type CookieParameterDeserializer<T extends ParameterValue> = Transform<string, T>
export type CookieSerializers<T extends ParameterType> = {
  [P in keyof T]: CookieParameterSerializer<T[P]>
}
export type CookieDeserializers<T extends ParameterType> = {
  [P in keyof T]: CookieParameterDeserializer<T[P]>
}

export type ParameterSegment = {
  type: 'parameter'
  name: string
}

export type TextSegment = {
  type: 'text'
  value: string
}

export type PathSegment = ParameterSegment | TextSegment
