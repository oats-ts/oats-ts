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
import { Sdk } from './Sdk'

export class SdkStub implements Sdk {
  public async getSimpleNamedObject(_config: Partial<ClientConfiguration> = {}): Promise<GetSimpleNamedObjectResponse> {
    throw new Error(
      'Stub method "getSimpleNamedObject" called. You should implement this method if you want to use it.',
    )
  }
  public async getWithDefaultResponse(
    _config: Partial<ClientConfiguration> = {},
  ): Promise<GetWithDefaultResponseResponse> {
    throw new Error(
      'Stub method "getWithDefaultResponse" called. You should implement this method if you want to use it.',
    )
  }
  public async getWithHeaderParams(
    _input: GetWithHeaderParamsRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<GetWithHeaderParamsResponse> {
    throw new Error('Stub method "getWithHeaderParams" called. You should implement this method if you want to use it.')
  }
  public async getWithMultipleResponses(
    _config: Partial<ClientConfiguration> = {},
  ): Promise<GetWithMultipleResponsesResponse> {
    throw new Error(
      'Stub method "getWithMultipleResponses" called. You should implement this method if you want to use it.',
    )
  }
  public async getWithPathParams(
    _input: GetWithPathParamsRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<GetWithPathParamsResponse> {
    throw new Error('Stub method "getWithPathParams" called. You should implement this method if you want to use it.')
  }
  public async getWithQueryParams(
    _input: GetWithQueryParamsRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<GetWithQueryParamsResponse> {
    throw new Error('Stub method "getWithQueryParams" called. You should implement this method if you want to use it.')
  }
  public async postSimpleNamedObject(
    _input: PostSimpleNamedObjectRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<PostSimpleNamedObjectResponse> {
    throw new Error(
      'Stub method "postSimpleNamedObject" called. You should implement this method if you want to use it.',
    )
  }
  public async sampleOperation(
    _input: SampleOperationRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<SampleOperationResponse> {
    throw new Error('Stub method "sampleOperation" called. You should implement this method if you want to use it.')
  }
}
