import { ClientConfiguration } from '@oats-ts/openapi-http'
import { getSimpleNamedObject } from '../operations/getSimpleNamedObject'
import { getWithDefaultResponse } from '../operations/getWithDefaultResponse'
import { getWithHeaderParams } from '../operations/getWithHeaderParams'
import { getWithMultipleResponses } from '../operations/getWithMultipleResponses'
import { getWithPathParams } from '../operations/getWithPathParams'
import { getWithQueryParams } from '../operations/getWithQueryParams'
import { postSimpleNamedObject } from '../operations/postSimpleNamedObject'
import { sampleOperation } from '../operations/sampleOperation'
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
import { Api } from './Api'

export class ApiImpl implements Api {
  protected readonly config: ClientConfiguration
  public constructor(config: ClientConfiguration) {
    this.config = config
  }
  public async getSimpleNamedObject(config: Partial<ClientConfiguration> = {}): Promise<GetSimpleNamedObjectResponse> {
    return getSimpleNamedObject({ ...this.config, ...config })
  }
  public async getWithDefaultResponse(
    config: Partial<ClientConfiguration> = {},
  ): Promise<GetWithDefaultResponseResponse> {
    return getWithDefaultResponse({ ...this.config, ...config })
  }
  public async getWithHeaderParams(
    input: GetWithHeaderParamsRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<GetWithHeaderParamsResponse> {
    return getWithHeaderParams(input, { ...this.config, ...config })
  }
  public async getWithMultipleResponses(
    config: Partial<ClientConfiguration> = {},
  ): Promise<GetWithMultipleResponsesResponse> {
    return getWithMultipleResponses({ ...this.config, ...config })
  }
  public async getWithPathParams(
    input: GetWithPathParamsRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<GetWithPathParamsResponse> {
    return getWithPathParams(input, { ...this.config, ...config })
  }
  public async getWithQueryParams(
    input: GetWithQueryParamsRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<GetWithQueryParamsResponse> {
    return getWithQueryParams(input, { ...this.config, ...config })
  }
  public async postSimpleNamedObject(
    input: PostSimpleNamedObjectRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<PostSimpleNamedObjectResponse> {
    return postSimpleNamedObject(input, { ...this.config, ...config })
  }
  public async sampleOperation(
    input: SampleOperationRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<SampleOperationResponse> {
    return sampleOperation(input, { ...this.config, ...config })
  }
}
