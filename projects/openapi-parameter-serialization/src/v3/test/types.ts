import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { CookieDslRoot, HeaderDslRoot, ParameterType, PathDslRoot, QueryDslRoot } from '../types'

type Nullable<A> = A | undefined | null

export type SuccessValue<A, B> = {
  model: Nullable<A>
  serialized: Nullable<B>
}

export type TestCase<
  Model extends ParameterType,
  Serialized,
  Dsl extends QueryDslRoot<Model> | PathDslRoot<Model> | HeaderDslRoot<Model> | CookieDslRoot<Model>,
> = {
  name: string
  only?: boolean
  ignore?: boolean
  dsl: Dsl
  data: SuccessValue<Model, Serialized>[]
  serializerErrors: Nullable<Model>[]
  deserializerErrors: Nullable<Serialized>[]
}

export type HeaderTestCase<Model extends ParameterType> = TestCase<Model, RawHttpHeaders, HeaderDslRoot<Model>>

export type QueryTestCase<Model extends ParameterType> = TestCase<Model, string, QueryDslRoot<Model>>

export type PathTestCase<Model extends ParameterType> = TestCase<Model, string, PathDslRoot<Model>>

export type CookieTestCase<Model extends ParameterType> = TestCase<Model, string, CookieDslRoot<Model>>
