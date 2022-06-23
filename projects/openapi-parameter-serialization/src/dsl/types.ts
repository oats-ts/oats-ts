import { Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'

export type Primitive = string | number | boolean | undefined
export type PrimitiveArray = ReadonlyArray<Primitive> | undefined
export type PrimitiveRecord = Record<string, Primitive> | undefined
export type PrimitiveValue = Primitive | PrimitiveArray | PrimitiveRecord
export type ParameterType = Record<string, PrimitiveValue>

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

export type OptionalDsl<T extends Primitive> = {
  type: 'optional'
  dsl: ValueDsl<T>
}

export type StringDsl<T extends Primitive = string> = {
  type: 'string'
  dsl?: ValueDsl<T>
}

export type NumberDsl<T extends Primitive = number> = {
  type: 'number'
  dsl?: ValueDsl<T>
}

export type BooleanDsl<T extends Primitive = boolean> = {
  type: 'boolean'
  dsl?: ValueDsl<T>
}

export type ValueDsl<T extends Primitive> =
  | StringDsl<T>
  | NumberDsl<T>
  | BooleanDsl<T>
  | EnumDsl<T>
  | OptionalDsl<T>
  | LiteralDsl<T>

export type DslCommon<T extends PrimitiveValue, D extends DslType, L extends DslLocation, S extends DslStyle> = {
  type: D
  location: L
  style: S
  required: boolean
  explode: boolean
}

export type PrimitiveDsl<T extends Primitive, L extends DslLocation, S extends DslStyle> = DslCommon<
  T,
  'primitive',
  L,
  S
> & {
  value: ValueDsl<T>
}

export type ItemsDsl<T extends PrimitiveArray> = ValueDsl<Exclude<T, undefined>[number]>

export type ArrayDsl<T extends PrimitiveArray, L extends DslLocation, S extends DslStyle> = DslCommon<
  T,
  'array',
  L,
  S
> & {
  items: ItemsDsl<T>
}

export type PropertiesDsl<T extends PrimitiveRecord> = { [P in keyof T]: ValueDsl<Exclude<T, undefined>[P]> }

export type ObjectDsl<T extends PrimitiveRecord, L extends DslLocation, S extends DslStyle> = DslCommon<
  T,
  'object',
  L,
  S
> & {
  properties: PropertiesDsl<T>
}

export type DslRoot<T extends ParameterType, L extends DslLocation, S extends DslStyle> = {
  [P in keyof T]: DslCommon<T[P], DslType, L, S>
}

export type QueryDsl<T extends ParameterType> = DslRoot<
  T,
  'query',
  'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject'
>

export type PathDsl<T extends ParameterType> = DslRoot<T, 'path', 'simple' | 'label' | 'matrix'>

export type HeaderDsl<T extends ParameterType> = DslRoot<T, 'header', 'simple'>

export type CookieDsl<T extends ParameterType> = DslRoot<T, 'cookie', 'form'>

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

export type Deserializer<I, O> = (input: I, name: string, path: string, config: ValidatorConfig) => Try<O>

export type Deserializers<I, O extends ParameterType> = { [P in keyof O]: Deserializer<I, O> }

export type PrimitiveDeserializerFactory<I, O extends Primitive> = (
  delegate: ValueDeserializer<any, O>,
  options?: Partial<DslConfig>,
) => Deserializer<I, O>

export type ArrayDeserializerFactory<I, O extends Primitive> = (
  delegate: ValueDeserializer<any, O>,
  options?: Partial<DslConfig>,
) => Deserializer<I, O[]>

export type ObjectDeserializerFactory<I, O extends ParameterType> = (
  delegate: Deserializers<any, O>,
  options?: Partial<DslConfig>,
) => Deserializer<I, O>
