import { GetWithHeaderParamsServerRequest } from '../requestServerTypes/GetWithHeaderParamsServerRequest'
import { GetWithPathParamsServerRequest } from '../requestServerTypes/GetWithPathParamsServerRequest'
import { GetWithQueryParamsServerRequest } from '../requestServerTypes/GetWithQueryParamsServerRequest'
import { PostSimpleNamedObjectServerRequest } from '../requestServerTypes/PostSimpleNamedObjectServerRequest'
import { SampleOperationServerRequest } from '../requestServerTypes/SampleOperationServerRequest'
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
  getWithHeaderParams(input: GetWithHeaderParamsServerRequest, extra: T): Promise<GetWithHeaderParamsResponse>
  getWithMultipleResponses(extra: T): Promise<GetWithMultipleResponsesResponse>
  getWithPathParams(input: GetWithPathParamsServerRequest, extra: T): Promise<GetWithPathParamsResponse>
  getWithQueryParams(input: GetWithQueryParamsServerRequest, extra: T): Promise<GetWithQueryParamsResponse>
  postSimpleNamedObject(input: PostSimpleNamedObjectServerRequest, extra: T): Promise<PostSimpleNamedObjectResponse>
  sampleOperation(input: SampleOperationServerRequest, extra: T): Promise<SampleOperationResponse>
}
