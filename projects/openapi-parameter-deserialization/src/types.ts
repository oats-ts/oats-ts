import { Try } from '@oats-ts/try'

/** Types that can be individual parameter values */
export type Primitive = string | number | boolean
export type PrimitiveArray = ReadonlyArray<Primitive>
export type PrimitiveRecord = Record<string, Primitive>

/** Union type for above */
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord

export type FieldParsers<T extends PrimitiveRecord> = { [P in keyof T]: ValueParser<string, T[P]> }

/** Object, collection of named parameter values */
export type ParameterObject = Record<string, ParameterValue>

export type ValueParser<I extends Primitive, O extends Primitive> = (name: string, input: I) => Try<O>

/** Query related types */
export type QueryOptions = {
  explode?: boolean
  required?: boolean
}

export type RawQueryParams = Record<string, string[]>
export type QueryDeserializer<T extends ParameterValue> = (name: string) => (value: RawQueryParams) => Try<T>
export type QueryDeserializers<T extends ParameterObject> = { [P in keyof T]: QueryDeserializer<T[P]> }

/** Path related types */
export type PathOptions = {
  explode?: boolean
}

export type RawPathParams = Record<string, string>
export type PathDeserializer<T extends ParameterValue> = (name: string) => (value: RawPathParams) => Try<T>
export type PathDeserializers<T extends ParameterObject> = { [P in keyof T]: PathDeserializer<T[P]> }

/** Header related types */
export type HeaderOptions = {
  explode?: boolean
  required?: boolean
}

export type RawHeaders = Record<string, string>
export type HeaderDeserializer<T extends ParameterValue> = (name: string) => (value: RawHeaders) => Try<T>
export type HeaderDeserializers<T extends ParameterObject> = { [P in keyof T]: HeaderDeserializer<T[P]> }
