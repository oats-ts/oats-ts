import { RequestConfig } from '@oats-ts/http'
import { GetWithHeaderParamsInput } from '../inputTypes/GetWithHeaderParamsInput'
import { GetWithPathParamsInput } from '../inputTypes/GetWithPathParamsInput'
import { GetWithQueryParamsInput } from '../inputTypes/GetWithQueryParamsInput'
import { PostSimpleNamedObjectInput } from '../inputTypes/PostSimpleNamedObjectInput'
import { SampleOperationInput } from '../inputTypes/SampleOperationInput'
import { getSimpleNamedObject } from '../operations/getSimpleNamedObject'
import { getWithDefaultResponse } from '../operations/getWithDefaultResponse'
import { getWithHeaderParams } from '../operations/getWithHeaderParams'
import { getWithMultipleResponses } from '../operations/getWithMultipleResponses'
import { getWithPathParams } from '../operations/getWithPathParams'
import { getWithQueryParams } from '../operations/getWithQueryParams'
import { postSimpleNamedObject } from '../operations/postSimpleNamedObject'
import { sampleOperation } from '../operations/sampleOperation'
import { GetSimpleNamedObjectResponse } from '../responseTypes/GetSimpleNamedObjectResponse'
import { GetWithDefaultResponseResponse } from '../responseTypes/GetWithDefaultResponseResponse'
import { GetWithHeaderParamsResponse } from '../responseTypes/GetWithHeaderParamsResponse'
import { GetWithMultipleResponsesResponse } from '../responseTypes/GetWithMultipleResponsesResponse'
import { GetWithPathParamsResponse } from '../responseTypes/GetWithPathParamsResponse'
import { GetWithQueryParamsResponse } from '../responseTypes/GetWithQueryParamsResponse'
import { PostSimpleNamedObjectResponse } from '../responseTypes/PostSimpleNamedObjectResponse'
import { SampleOperationResponse } from '../responseTypes/SampleOperationResponse'
import { Api } from './Api'

export class ApiImpl implements Api {
  protected readonly config: RequestConfig
  public constructor(config: RequestConfig) {
    this.config = config
  }
  public async getSimpleNamedObject(config: Partial<RequestConfig> = {}): Promise<GetSimpleNamedObjectResponse> {
    return getSimpleNamedObject({ ...this.config, ...config })
  }
  public async getWithDefaultResponse(config: Partial<RequestConfig> = {}): Promise<GetWithDefaultResponseResponse> {
    return getWithDefaultResponse({ ...this.config, ...config })
  }
  public async getWithHeaderParams(
    input: GetWithHeaderParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithHeaderParamsResponse> {
    return getWithHeaderParams(input, { ...this.config, ...config })
  }
  public async getWithMultipleResponses(
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithMultipleResponsesResponse> {
    return getWithMultipleResponses({ ...this.config, ...config })
  }
  public async getWithPathParams(
    input: GetWithPathParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithPathParamsResponse> {
    return getWithPathParams(input, { ...this.config, ...config })
  }
  public async getWithQueryParams(
    input: GetWithQueryParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithQueryParamsResponse> {
    return getWithQueryParams(input, { ...this.config, ...config })
  }
  public async postSimpleNamedObject(
    input: PostSimpleNamedObjectInput,
    config: Partial<RequestConfig> = {},
  ): Promise<PostSimpleNamedObjectResponse> {
    return postSimpleNamedObject(input, { ...this.config, ...config })
  }
  public async sampleOperation(
    input: SampleOperationInput,
    config: Partial<RequestConfig> = {},
  ): Promise<SampleOperationResponse> {
    return sampleOperation(input, { ...this.config, ...config })
  }
}
