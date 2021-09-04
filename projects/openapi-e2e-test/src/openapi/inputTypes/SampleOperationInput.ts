import { SampleOperationHeaderParameters } from '../headerTypes/SampleOperationHeaderParameters'
import { SampleOperationPathParameters } from '../pathTypes/SampleOperationPathParameters'
import { SampleOperationQueryParameters } from '../queryTypes/SampleOperationQueryParameters'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

type _SampleOperationInput<MimeType extends string, Body> = {
  headers: SampleOperationHeaderParameters
  query: SampleOperationQueryParameters
  path: SampleOperationPathParameters
  mimeType: MimeType
  body: Body
}

export type SampleOperationInput =
  | _SampleOperationInput<'application/json', NamedSimpleObject>
  | _SampleOperationInput<'text/plain', string>
