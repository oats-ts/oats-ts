/** Types that can be individual parameter values */
export type Primitive = string | number | boolean
export type PrimitiveArray = ReadonlyArray<Primitive>
export type PrimitiveRecord = Record<string, Primitive>

/** Union type for above */
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord

export type ObjectDeserializer<T extends PrimitiveRecord> = { [P in keyof T]: PrimitiveParser<string, T[P]> }

/** Object, collection of named parameter values */
export type ParameterObject = Record<string, ParameterValue>

export type PrimitiveParser<I extends Primitive, O extends Primitive> = (name: string, input: I) => O

/** Query related types */
export type QueryOptions = {
  explode?: boolean
  required?: boolean
}

export type RawQueryParams = Record<string, string[]>
export type QueryDeserializer<T extends ParameterValue> = (name: string) => (value: RawQueryParams) => T
export type QueryDeserializers<T extends ParameterObject> = { [P in keyof T]: QueryDeserializer<T[P]> }

/** Path related types */
export type PathOptions<T> = {
  defaultValue?: T
  explode?: boolean
}

export type PathDeserializer<T extends ParameterValue> = (name: string) => (value: T) => string
export type PathDeserializers<T extends ParameterObject> = { [P in keyof T]: PathDeserializer<T[P]> }

/** Path parsing, represents path segments */
export type ParameterSegment = {
  type: 'parameter'
  name: string
}

export type TextSegment = {
  type: 'text'
  value: string
}

export type PathSegment = ParameterSegment | TextSegment

/** Header related types */
export type HeaderOptions<T> = {
  defaultValue?: T
  explode?: boolean
  required?: boolean
}

export type HeaderDeserializer<T extends ParameterValue> = (name: string) => (value: T) => string
export type HeaderDeserializers<T extends ParameterObject> = { [P in keyof T]: HeaderDeserializer<T[P]> }
