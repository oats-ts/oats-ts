import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { Try } from '@oats-ts/try'

export type Primitive = string | number | boolean | undefined
export type PrimitiveArray = ReadonlyArray<Primitive> | undefined
export type PrimitiveRecord = Record<string, Primitive> | undefined
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord

export type DslType = 'primitive' | 'array' | 'object'
export type DslLocation = 'query' | 'header' | 'path' | 'cookie'

export type QueryStyle = 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
export type PathStyle = 'simple' | 'label' | 'matrix'
export type HeaderStyle = 'simple'
export type CookieStyle = 'form'

export type DslStyle = QueryStyle | PathStyle | HeaderStyle | CookieStyle

export type EnumDsl = {
  type: 'enum'
  values: Primitive[]
}

export type LiteralDsl = {
  type: 'literal'
  value: Primitive
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

export type DslCommon<T extends DslType, L extends DslLocation, S extends DslStyle> = {
  type: T
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

export type PathPrimitive = PrimitiveDsl<'path', PathStyle>
export type PathArray = ArrayDsl<'path', PathStyle>
export type PathObject = ObjectDsl<'path', PathStyle>

export type QueryPrimitive = PrimitiveDsl<'query', QueryStyle>
export type QueryArray = ArrayDsl<'query', QueryStyle>
export type QueryObject = ObjectDsl<'query', QueryStyle>

export type HeaderPrimitive = PrimitiveDsl<'header', HeaderStyle>
export type HeaderArray = ArrayDsl<'header', HeaderStyle>
export type HeaderObject = ObjectDsl<'header', HeaderStyle>

export type CookiePrimitive = PrimitiveDsl<'cookie', CookieStyle>

export type PathDsl = Dsl<'path', PathStyle>
export type QueryDsl = Dsl<'query', QueryStyle>
export type HeaderDsl = Dsl<'header', HeaderStyle>
export type CookieDsl = Dsl<'cookie', CookieStyle>

export type DslRoot<T, L extends DslLocation, S extends DslStyle> = {
  [P in keyof T]: Dsl<L, S>
}

export type QueryDslRoot<T> = {
  schema: DslRoot<T, 'query', QueryStyle>
}

export type PathDslRoot<T> = {
  schema: DslRoot<T, 'path', PathStyle>
  pathSegments: PathSegment[]
  matcher: RegExp
}

export type HeaderDslRoot<T> = {
  schema: DslRoot<T, 'header', HeaderStyle>
}

export type CookieDslRoot<T> = {
  schema: DslRoot<T, 'cookie', CookieStyle>
}

export type ValueDeserializer = {
  deserialize(dsl: ValueDsl, data: Primitive, name: string, path: string): Try<Primitive>
}

export type PathSerializer<T> = {
  /**
   * Serializes the given path parameters from a model object to a path string
   * @param params The path parameters
   */
  serialize(params: T): Try<string>
}

export type QuerySerializer<T> = {
  /**
   * Serializes the given query parameters from a model object to a query string
   * @param params The query parameters
   */
  serialize(params: T): Try<string | undefined>
}

export type HeadersSerializer<T> = {
  /**
   * Serializes the given header parameters from a model object to a raw header object
   * @param params The header parameters
   */
  serialize(params: T): Try<RawHttpHeaders>
}

export type CookieSerializer<T> = {
  /**
   * Serializes the given cookie parameters from a model object to a cookie string
   * @param params The cookie parameters
   */
  serialize(params: T): Try<string>
}

export type PathDeserializer<T> = {
  deserialize(path: string): Try<T>
}

export type QueryDeserializer<T> = {
  deserialize(query: string): Try<T>
}

export type HeaderDeserializer<T> = {
  deserialize(headers: RawHttpHeaders): Try<T>
}

export type CookieDeserializer<T> = {
  deserialize(cookies: string): Try<T>
}

export type RawPath = Record<string, string>
export type RawQuery = Record<string, string[]>

export type ParameterSegment = {
  type: 'parameter'
  name: string
}

export type TextSegment = {
  type: 'text'
  value: string
}

export type PathSegment = ParameterSegment | TextSegment
