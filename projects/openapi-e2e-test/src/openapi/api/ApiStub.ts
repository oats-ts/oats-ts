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
import { Api } from './Api'

export class ApiStub implements Api {
  public async getSimpleNamedObject(_config: Partial<RequestConfig> = {}): Promise<GetSimpleNamedObjectResponse> {
    throw new Error('"getSimpleNamedObject" is not implemented')
  }
  public async getWithDefaultResponse(_config: Partial<RequestConfig> = {}): Promise<GetWithDefaultResponseResponse> {
    throw new Error('"getWithDefaultResponse" is not implemented')
  }
  public async getWithHeaderParams(
    _input: GetWithHeaderParamsInput,
    _config: Partial<RequestConfig> = {},
  ): Promise<GetWithHeaderParamsResponse> {
    throw new Error('"getWithHeaderParams" is not implemented')
  }
  public async getWithMultipleResponses(
    _config: Partial<RequestConfig> = {},
  ): Promise<GetWithMultipleResponsesResponse> {
    throw new Error('"getWithMultipleResponses" is not implemented')
  }
  public async getWithPathParams(
    _input: GetWithPathParamsInput,
    _config: Partial<RequestConfig> = {},
  ): Promise<GetWithPathParamsResponse> {
    throw new Error('"getWithPathParams" is not implemented')
  }
  public async getWithQueryParams(
    _input: GetWithQueryParamsInput,
    _config: Partial<RequestConfig> = {},
  ): Promise<GetWithQueryParamsResponse> {
    throw new Error('"getWithQueryParams" is not implemented')
  }
  public async postSimpleNamedObject(
    _input: PostSimpleNamedObjectInput,
    _config: Partial<RequestConfig> = {},
  ): Promise<PostSimpleNamedObjectResponse> {
    throw new Error('"postSimpleNamedObject" is not implemented')
  }
  public async sampleOperation(
    _input: SampleOperationInput,
    _config: Partial<RequestConfig> = {},
  ): Promise<SampleOperationResponse> {
    throw new Error('"sampleOperation" is not implemented')
  }
}
