import { ParameterIssues } from '@oats-ts/openapi-http-server'
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

export type Api<T> = {
  getSimpleNamedObject(extra: T): Promise<GetSimpleNamedObjectResponse>
  getWithDefaultResponse(extra: T): Promise<GetWithDefaultResponseResponse>
  getWithHeaderParams(
    input: GetWithHeaderParamsRequest | ParameterIssues,
    extra: T,
  ): Promise<GetWithHeaderParamsResponse>
  getWithMultipleResponses(extra: T): Promise<GetWithMultipleResponsesResponse>
  getWithPathParams(input: GetWithPathParamsRequest | ParameterIssues, extra: T): Promise<GetWithPathParamsResponse>
  getWithQueryParams(input: GetWithQueryParamsRequest | ParameterIssues, extra: T): Promise<GetWithQueryParamsResponse>
  postSimpleNamedObject(
    input: PostSimpleNamedObjectRequest | ParameterIssues,
    extra: T,
  ): Promise<PostSimpleNamedObjectResponse>
  sampleOperation(input: SampleOperationRequest | ParameterIssues, extra: T): Promise<SampleOperationResponse>
}
