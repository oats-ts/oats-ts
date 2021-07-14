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
import { Api } from './Api'

export class ApiStub implements Api {
  protected fallback(): never {
    throw new Error('Not implemented.')
  }
  public async getSimpleNamedObject(config: Partial<RequestConfig> = {}): Promise<GetSimpleNamedObjectResponse> {
    return this.fallback()
  }
  public async getWithDefaultResponse(config: Partial<RequestConfig> = {}): Promise<GetWithDefaultResponseResponse> {
    return this.fallback()
  }
  public async getWithHeaderParams(
    input: GetWithHeaderParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithHeaderParamsResponse> {
    return this.fallback()
  }
  public async getWithMultipleResponses(
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithMultipleResponsesResponse> {
    return this.fallback()
  }
  public async getWithPathParams(
    input: GetWithPathParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithPathParamsResponse> {
    return this.fallback()
  }
  public async getWithQueryParams(
    input: GetWithQueryParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithQueryParamsResponse> {
    return this.fallback()
  }
  public async postSimpleNamedObject(
    input: PostSimpleNamedObjectInput,
    config: Partial<RequestConfig> = {},
  ): Promise<PostSimpleNamedObjectResponse> {
    return this.fallback()
  }
}
