import { RequestConfig } from '@oats-ts/http'
import { GetSimpleNamedObjectResponse } from '../responseTypes/GetSimpleNamedObjectResponse'
import { GetWithDefaultResponseResponse } from '../responseTypes/GetWithDefaultResponseResponse'
import { GetWithHeaderParamsInput } from '../inputTypes/GetWithHeaderParamsInput'
import { GetWithHeaderParamsResponse } from '../responseTypes/GetWithHeaderParamsResponse'
import { GetWithMultipleResponsesResponse } from '../responseTypes/GetWithMultipleResponsesResponse'
import { GetWithPathParamsInput } from '../inputTypes/GetWithPathParamsInput'
import { GetWithPathParamsResponse } from '../responseTypes/GetWithPathParamsResponse'
import { GetWithQueryParamsInput } from '../inputTypes/GetWithQueryParamsInput'
import { GetWithQueryParamsResponse } from '../responseTypes/GetWithQueryParamsResponse'
import { PostSimpleNamedObjectInput } from '../inputTypes/PostSimpleNamedObjectInput'
import { PostSimpleNamedObjectResponse } from '../responseTypes/PostSimpleNamedObjectResponse'
import { SampleOperationInput } from '../inputTypes/SampleOperationInput'
import { SampleOperationResponse } from '../responseTypes/SampleOperationResponse'
import { Api } from './Api'

export class ApiStub implements Api {
  public async getSimpleNamedObject(config: Partial<RequestConfig> = {}): Promise<GetSimpleNamedObjectResponse> {
    throw new Error('"getSimpleNamedObject" is not implemented')
  }
  public async getWithDefaultResponse(config: Partial<RequestConfig> = {}): Promise<GetWithDefaultResponseResponse> {
    throw new Error('"getWithDefaultResponse" is not implemented')
  }
  public async getWithHeaderParams(
    input: GetWithHeaderParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithHeaderParamsResponse> {
    throw new Error('"getWithHeaderParams" is not implemented')
  }
  public async getWithMultipleResponses(
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithMultipleResponsesResponse> {
    throw new Error('"getWithMultipleResponses" is not implemented')
  }
  public async getWithPathParams(
    input: GetWithPathParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithPathParamsResponse> {
    throw new Error('"getWithPathParams" is not implemented')
  }
  public async getWithQueryParams(
    input: GetWithQueryParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithQueryParamsResponse> {
    throw new Error('"getWithQueryParams" is not implemented')
  }
  public async postSimpleNamedObject(
    input: PostSimpleNamedObjectInput,
    config: Partial<RequestConfig> = {},
  ): Promise<PostSimpleNamedObjectResponse> {
    throw new Error('"postSimpleNamedObject" is not implemented')
  }
  public async sampleOperation(
    input: SampleOperationInput,
    config: Partial<RequestConfig> = {},
  ): Promise<SampleOperationResponse> {
    throw new Error('"sampleOperation" is not implemented')
  }
}
