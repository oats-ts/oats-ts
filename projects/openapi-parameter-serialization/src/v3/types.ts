import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { Try } from '@oats-ts/try'

export type Primitive = string | number | boolean | undefined
export type PrimitiveArray = ReadonlyArray<Primitive> | undefined
export type PrimitiveRecord = Record<string, Primitive> | undefined
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord
export type ParameterType = Record<string, ParameterValue>

export type Type = 'primitive' | 'array' | 'object'
export type Location = 'query' | 'header' | 'path' | 'cookie'

export type QueryStyle = 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
export type PathStyle = 'simple' | 'label' | 'matrix'
export type HeaderStyle = 'simple'
export type CookieStyle = 'form'

export type Style = QueryStyle | PathStyle | HeaderStyle | CookieStyle

export type EnumDescriptor = {
  type: 'enum'
  values: Primitive[]
}

export type LiteralDescriptor = {
  type: 'literal'
  value: Primitive
}

export type OptionalDescriptor = {
  type: 'optional'
  value: ValueDescriptor
}

export type StringDescriptor = {
  type: 'string'
  value?: ValueDescriptor
}

export type NumberDescriptor = {
  type: 'number'
  value?: ValueDescriptor
}

export type BooleanDescriptor = {
  type: 'boolean'
  value?: ValueDescriptor
}

export type ValueDescriptor =
  | StringDescriptor
  | NumberDescriptor
  | BooleanDescriptor
  | EnumDescriptor
  | OptionalDescriptor
  | LiteralDescriptor

export type DescriptorCommon<T extends Type, L extends Location, S extends Style> = {
  type: T
  location: L
  style: S
  required: boolean
  explode: boolean
}

export type PrimitiveDescriptor<L extends Location, S extends Style> = DescriptorCommon<'primitive', L, S> & {
  value: ValueDescriptor
}

export type ArrayDescriptor<L extends Location, S extends Style> = DescriptorCommon<'array', L, S> & {
  items: ValueDescriptor
}

export type PropertyDescriptors = Record<string, ValueDescriptor>

export type ObjectDescriptor<L extends Location, S extends Style> = DescriptorCommon<'object', L, S> & {
  properties: PropertyDescriptors
}

export type ParameterDescriptor<L extends Location, S extends Style> =
  | PrimitiveDescriptor<L, S>
  | ArrayDescriptor<L, S>
  | ObjectDescriptor<L, S>

export type PathPrimitive = PrimitiveDescriptor<'path', PathStyle>
export type PathArray = ArrayDescriptor<'path', PathStyle>
export type PathObject = ObjectDescriptor<'path', PathStyle>

export type QueryPrimitive = PrimitiveDescriptor<'query', QueryStyle>
export type QueryArray = ArrayDescriptor<'query', QueryStyle>
export type QueryObject = ObjectDescriptor<'query', QueryStyle>

export type HeaderPrimitive = PrimitiveDescriptor<'header', HeaderStyle>
export type HeaderArray = ArrayDescriptor<'header', HeaderStyle>
export type HeaderObject = ObjectDescriptor<'header', HeaderStyle>

export type CookiePrimitive = PrimitiveDescriptor<'cookie', CookieStyle>

export type PathParameterDescriptor = ParameterDescriptor<'path', PathStyle>
export type QueryParameterDescriptor = ParameterDescriptor<'query', QueryStyle>
export type HeaderParameterDescriptor = ParameterDescriptor<'header', HeaderStyle>
export type CookieParameterDescriptor = ParameterDescriptor<'cookie', CookieStyle>

export type ParameterDescriptors<T, L extends Location, S extends Style> = {
  [P in keyof T]: ParameterDescriptor<L, S>
}

export type QueryParameters<T> = {
  descriptor: ParameterDescriptors<T, 'query', QueryStyle>
}

export type PathParameters<T> = {
  descriptor: ParameterDescriptors<T, 'path', PathStyle>
  pathSegments: PathSegment[]
  matcher: RegExp
}

export type HeaderParameters<T> = {
  descriptor: ParameterDescriptors<T, 'header', HeaderStyle>
}

export type CookieParameters<T> = {
  descriptor: ParameterDescriptors<T, 'cookie', CookieStyle>
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

export type ValueDeserializer = {
  deserialize(descriptor: ValueDescriptor, data: Primitive, path: string): Try<Primitive>
}

export type ValueSerializer = {
  serialize(descriptor: ValueDescriptor, data: Primitive, path: string): Try<string | undefined>
}

export type PathSerializer<T> = {
  serialize(params: T): Try<string>
}

export type QuerySerializer<T> = {
  serialize(params: T): Try<string | undefined>
}

export type HeadersSerializer<T> = {
  serialize(params: T): Try<RawHttpHeaders>
}

export type CookieSerializer<T> = {
  serialize(params: T): Try<string | undefined>
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
