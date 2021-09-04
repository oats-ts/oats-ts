import { RequestConfig } from '@oats-ts/http'
import { GetWithHeaderParamsInput } from '../inputTypes/GetWithHeaderParamsInput'
import { GetWithPathParamsInput } from '../inputTypes/GetWithPathParamsInput'
import { GetWithQueryParamsInput } from '../inputTypes/GetWithQueryParamsInput'
import { PostSimpleNamedObjectInput } from '../inputTypes/PostSimpleNamedObjectInput'
import { SampleOperationInput } from '../inputTypes/SampleOperationInput'
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
    input: GetWithHeaderParamsInput,
    config?: Partial<RequestConfig>,
  ): Promise<GetWithHeaderParamsResponse>
  getWithMultipleResponses(config?: Partial<RequestConfig>): Promise<GetWithMultipleResponsesResponse>
  getWithPathParams(input: GetWithPathParamsInput, config?: Partial<RequestConfig>): Promise<GetWithPathParamsResponse>
  getWithQueryParams(
    input: GetWithQueryParamsInput,
    config?: Partial<RequestConfig>,
  ): Promise<GetWithQueryParamsResponse>
  postSimpleNamedObject(
    input: PostSimpleNamedObjectInput,
    config?: Partial<RequestConfig>,
  ): Promise<PostSimpleNamedObjectResponse>
  sampleOperation(input: SampleOperationInput, config?: Partial<RequestConfig>): Promise<SampleOperationResponse>
}
