import { Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'

/** Types that can be individual parameter values */
export type Primitive = string | number | boolean
export type PrimitiveArray = ReadonlyArray<Primitive>
export type PrimitiveRecord = Record<string, Primitive>

/** Union type for above */
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord

export type FieldParsers<T extends PrimitiveRecord> = { [P in keyof T]: ValueParser<string, T[P]> }

/** Object, collection of named parameter values */
export type ParameterObject = Record<string, ParameterValue>

export type ValueParser<I extends Primitive, O extends Primitive> = (
  input: I,
  name: string,
  path: string,
  config: ValidatorConfig,
) => Try<O>

/** Query related types */
export type QueryOptions = {
  explode?: boolean
  required?: boolean
}

export type RawQueryParams = Record<string, string[]>
export type QueryValueDeserializer<T extends ParameterValue> = (
  value: RawQueryParams,
  name: string,
  path: string,
  config: ValidatorConfig,
) => Try<T>
export type QueryValueDeserializers<T extends ParameterObject> = { [P in keyof T]: QueryValueDeserializer<T[P]> }
export type QueryDeserializer<T extends ParameterObject> = (
  input: string,
  path?: string,
  config?: ValidatorConfig,
) => Try<T>

/** Path related types */
export type PathOptions = {
  explode?: boolean
}

export type RawPathParams = Record<string, string>
export type PathValueDeserializer<T extends ParameterValue> = (
  value: RawPathParams,
  name: string,
  path: string,
  config: ValidatorConfig,
) => Try<T>
export type PathValueDeserializers<T extends ParameterObject> = { [P in keyof T]: PathValueDeserializer<T[P]> }
export type PathDeserializer<T extends ParameterObject> = (
  input: string,
  path?: string,
  config?: ValidatorConfig,
) => Try<T>

/** Header related types */
export type HeaderOptions = {
  explode?: boolean
  required?: boolean
}

export type RawHeaders = Record<string, string>
export type HeaderValueDeserializer<T extends ParameterValue> = (
  value: RawHeaders,
  name: string,
  path: string,
  config: ValidatorConfig,
) => Try<T>
export type HeaderValueDeserializers<T extends ParameterObject> = { [P in keyof T]: HeaderValueDeserializer<T[P]> }
export type HeaderDeserializer<T extends ParameterObject> = (
  input: RawHeaders,
  path?: string,
  config?: ValidatorConfig,
) => Try<T>
