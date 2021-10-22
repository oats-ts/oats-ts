import { HasHeaders, HasPathParameters, HasQueryParameters, HasRequestBody } from '@oats-ts/openapi-http'
import { SampleOperationPathParameters } from '../pathTypes/SampleOperationPathParameters'
import { SampleOperationQueryParameters } from '../queryTypes/SampleOperationQueryParameters'
import { SampleOperationRequestHeaderParameters } from '../requestHeaderTypes/SampleOperationRequestHeaderParameters'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type SampleOperationRequest =
  | (HasHeaders<SampleOperationRequestHeaderParameters> &
      HasQueryParameters<SampleOperationQueryParameters> &
      HasPathParameters<SampleOperationPathParameters> &
      HasRequestBody<'application/json', NamedSimpleObject>)
  | (HasHeaders<SampleOperationRequestHeaderParameters> &
      HasQueryParameters<SampleOperationQueryParameters> &
      HasPathParameters<SampleOperationPathParameters> &
      HasRequestBody<'text/plain', string>)
