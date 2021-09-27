import { SampleOperationHeaderParameters } from '../headerTypes/SampleOperationHeaderParameters'
import { SampleOperationPathParameters } from '../pathTypes/SampleOperationPathParameters'
import { SampleOperationQueryParameters } from '../queryTypes/SampleOperationQueryParameters'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

type _SampleOperationRequest<MimeType extends string, Body> = {
  headers: SampleOperationHeaderParameters
  query: SampleOperationQueryParameters
  path: SampleOperationPathParameters
  mimeType: MimeType
  body: Body
}

export type SampleOperationRequest =
  | _SampleOperationRequest<'application/json', NamedSimpleObject>
  | _SampleOperationRequest<'text/plain', string>
