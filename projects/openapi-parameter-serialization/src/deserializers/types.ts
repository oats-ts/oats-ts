import { Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { ParameterValue, Primitive, PrimitiveRecord, RawHeaders, RawPathParams, RawQueryParams } from '..//types'
import { ParameterObject } from '../serializers/types'

export type FieldParsers<T extends PrimitiveRecord> = {
  [P in keyof Required<T>]: ValueParser<string, Exclude<T, undefined>[P]>
}

/** Object, collection of named parameter values */

export type ValueParser<I extends Primitive, O extends Primitive> = (
  input: I,
  name: string,
  path: string,
  config: ValidatorConfig,
) => Try<O>

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
