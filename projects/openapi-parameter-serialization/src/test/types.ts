import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { CookieParameters, HeaderParameters, ParameterType, PathParameters, QueryParameters } from '../types'

type Nullable<A> = A | undefined | null

export type SuccessValue<A, B> = {
  model: Nullable<A>
  serialized: Nullable<B>
}

export type TestCase<
  Model extends ParameterType,
  Serialized,
  D extends QueryParameters<Model> | PathParameters<Model> | HeaderParameters<Model> | CookieParameters<Model>,
> = {
  name: string
  only?: boolean
  ignore?: boolean
  descriptor: D
  data: SuccessValue<Model, Serialized>[]
  serializerErrors: Nullable<Model>[]
  deserializerErrors: Nullable<Serialized>[]
}

export type HeaderTestCase<Model extends ParameterType> = TestCase<Model, RawHttpHeaders, HeaderParameters<Model>>

export type QueryTestCase<Model extends ParameterType> = TestCase<Model, string, QueryParameters<Model>>

export type PathTestCase<Model extends ParameterType> = TestCase<Model, string, PathParameters<Model>>

export type CookieTestCase<Model extends ParameterType> = TestCase<Model, string, CookieParameters<Model>>
