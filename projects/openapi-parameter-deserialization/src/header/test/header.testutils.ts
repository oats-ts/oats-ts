import { createHeaderDeserializer } from '../createHeaderDeserializer'
import { ParameterObject, HeaderDeserializers, RawHeaders } from '../../types'
import { ObjectTypesObject, PrimitiveTypesObject, StyleObject, TestDataObject, TypesObject } from '../../testTypes'
import { createTestSuiteFactory } from '../../testutils'

export type HeaderSuccessData<Data extends ParameterObject> = [Data, RawHeaders]
export type HeaderErrorData = [RawHeaders]

export type HeaderTestData<Data extends ParameterObject> = {
  data: HeaderSuccessData<Data>[]
  error: HeaderErrorData[]
}

export function h(value: string): RawHeaders {
  return { value }
}

