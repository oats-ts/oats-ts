import { NamedSimpleObject } from '../types/NamedSimpleObject'
import { SampleOperationPathParameters } from '../pathTypes/SampleOperationPathParameters'
import { SampleOperationQueryParameters } from '../queryTypes/SampleOperationQueryParameters'
import { SampleOperationHeaderParameters } from '../headerTypes/SampleOperationHeaderParameters'

type _SampleOperationInput<ContentType extends string, Body> = {
  headers: SampleOperationHeaderParameters
  query: SampleOperationQueryParameters
  path: SampleOperationPathParameters
  contentType: ContentType
  body: Body
}

export type SampleOperationInput =
  | _SampleOperationInput<'application/json', NamedSimpleObject>
  | _SampleOperationInput<'text/plain', string>
