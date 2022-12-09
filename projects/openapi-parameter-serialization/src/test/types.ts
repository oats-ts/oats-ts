import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { CookieParameters, HeaderParameters, PathParameters, QueryParameters } from '../types'

type Nullable<A> = A | undefined | null

export type SuccessValue<A, B> = {
  model: Nullable<A>
  serialized: Nullable<B>
}

export type TestCase<
  Model,
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

export type HeaderTestCase<Model> = TestCase<Model, RawHttpHeaders, HeaderParameters<Model>>

export type QueryTestCase<Model> = TestCase<Model, string, QueryParameters<Model>>

export type PathTestCase<Model> = TestCase<Model, string, PathParameters<Model>>

export type CookieTestCase<Model> = TestCase<Model, string, CookieParameters<Model>>
