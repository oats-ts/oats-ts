import { RequestConfig } from '@oats-ts/http'
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

export type Api = {
  getSimpleNamedObject(config?: Partial<RequestConfig>): Promise<GetSimpleNamedObjectResponse>
  getWithDefaultResponse(config?: Partial<RequestConfig>): Promise<GetWithDefaultResponseResponse>
  getWithHeaderParams(
    input: GetWithHeaderParamsRequest,
    config?: Partial<RequestConfig>,
  ): Promise<GetWithHeaderParamsResponse>
  getWithMultipleResponses(config?: Partial<RequestConfig>): Promise<GetWithMultipleResponsesResponse>
  getWithPathParams(
    input: GetWithPathParamsRequest,
    config?: Partial<RequestConfig>,
  ): Promise<GetWithPathParamsResponse>
  getWithQueryParams(
    input: GetWithQueryParamsRequest,
    config?: Partial<RequestConfig>,
  ): Promise<GetWithQueryParamsResponse>
  postSimpleNamedObject(
    input: PostSimpleNamedObjectRequest,
    config?: Partial<RequestConfig>,
  ): Promise<PostSimpleNamedObjectResponse>
  sampleOperation(input: SampleOperationRequest, config?: Partial<RequestConfig>): Promise<SampleOperationResponse>
}
