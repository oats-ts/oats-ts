import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { CookieDescriptorRule, HeaderDescriptorRule, PathDescriptorRule, QueryDescriptorRule } from '@oats-ts/rules'

type Nullable<A> = A | undefined | null

export type SuccessValue<A, B> = {
  model: Nullable<A>
  serialized: Nullable<B>
}

export type TestCase<
  Model,
  Serialized,
  D extends
    | QueryDescriptorRule<Model>
    | PathDescriptorRule<Model>
    | HeaderDescriptorRule<Model>
    | CookieDescriptorRule<Model>,
> = {
  name: string
  only?: boolean
  ignore?: boolean
  descriptor: D
  data: SuccessValue<Model, Serialized>[]
  serializerErrors: Nullable<Model>[]
  deserializerErrors: Nullable<Serialized>[]
}

export type HeaderTestCase<Model> = TestCase<Model, RawHttpHeaders, HeaderDescriptorRule<Model>>

export type QueryTestCase<Model> = TestCase<Model, string, QueryDescriptorRule<Model>>

export type PathTestCase<Model> = TestCase<Model, string, PathDescriptorRule<Model>>

export type CookieTestCase<Model> = TestCase<Model, string, CookieDescriptorRule<Model>>
