import { ClientConfiguration } from '@oats-ts/openapi-http'
import { GetWithHeaderParamsRequest } from '../requestTypes/GetWithHeaderParamsRequest'
import { GetWithPathParamsRequest } from '../requestTypes/GetWithPathParamsRequest'
import { GetWithQueryParamsRequest } from '../requestTypes/GetWithQueryParamsRequest'
import { PostSimpleNamedObjectRequest } from '../requestTypes/PostSimpleNamedObjectRequest'
import { SampleOperationRequest } from '../requestTypes/SampleOperationRequest'
import { GetSimpleNamedObjectResponse } from '../responseTypes/GetSimpleNamedObjectResponse'
import { GetWithDefaultResponseResponse } from '../responseTypes/GetWithDefaultResponseResponse'
import { GetWithHeaderParamsResponse } from '../responseTypes/GetWithHeaderParamsResponse'
import { GetWithMultipleResponsesResponse } from '../responseTypes/GetWithMultipleResponsesResponse'
import { GetWithPathParamsResponse } from '../responseTypes/GetWithPathParamsResponse'
import { GetWithQueryParamsResponse } from '../responseTypes/GetWithQueryParamsResponse'
import { PostSimpleNamedObjectResponse } from '../responseTypes/PostSimpleNamedObjectResponse'
import { SampleOperationResponse } from '../responseTypes/SampleOperationResponse'

export type Sdk = {
  getSimpleNamedObject(config?: Partial<ClientConfiguration>): Promise<GetSimpleNamedObjectResponse>
  getWithDefaultResponse(config?: Partial<ClientConfiguration>): Promise<GetWithDefaultResponseResponse>
  getWithHeaderParams(
    input: GetWithHeaderParamsRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<GetWithHeaderParamsResponse>
  getWithMultipleResponses(config?: Partial<ClientConfiguration>): Promise<GetWithMultipleResponsesResponse>
  getWithPathParams(
    input: GetWithPathParamsRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<GetWithPathParamsResponse>
  getWithQueryParams(
    input: GetWithQueryParamsRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<GetWithQueryParamsResponse>
  postSimpleNamedObject(
    input: PostSimpleNamedObjectRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<PostSimpleNamedObjectResponse>
  sampleOperation(
    input: SampleOperationRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<SampleOperationResponse>
}
