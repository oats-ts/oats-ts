import { HasHeaders, HasPathParameters, HasQueryParameters, HasRequestBody } from '@oats-ts/openapi-http'
import { SampleOperationHeaderParameters } from '../headerTypes/SampleOperationHeaderParameters'
import { SampleOperationPathParameters } from '../pathTypes/SampleOperationPathParameters'
import { SampleOperationQueryParameters } from '../queryTypes/SampleOperationQueryParameters'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type SampleOperationRequest =
  | (HasHeaders<SampleOperationHeaderParameters> &
      HasQueryParameters<SampleOperationQueryParameters> &
      HasPathParameters<SampleOperationPathParameters> &
      HasRequestBody<'application/json', NamedSimpleObject>)
  | (HasHeaders<SampleOperationHeaderParameters> &
      HasQueryParameters<SampleOperationQueryParameters> &
      HasPathParameters<SampleOperationPathParameters> &
      HasRequestBody<'text/plain', string>)
