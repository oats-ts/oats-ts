import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { DslLocation, DslRoot, DslStyle, HeaderStyle, ParameterType } from '../types'

type Nullable<A> = A | undefined | null

export type SuccessValue<A, B> = {
  from: Nullable<A>
  to: Nullable<B>
}

export type TestCase<A extends ParameterType, B, L extends DslLocation, S extends DslStyle> = {
  name: string
  only?: boolean
  ignore?: boolean
  dsl: DslRoot<A, L, S>
  serialize: SuccessValue<A, B>[]
  deserialize: SuccessValue<B, A>[]
  serializerErrors: Nullable<A>[]
  deserializerErrors: Nullable<B>[]
}

export type HeaderTestCase<A extends ParameterType> = TestCase<A, RawHttpHeaders, 'header', HeaderStyle>
