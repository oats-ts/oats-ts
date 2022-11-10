/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/optional-request-body.json
 */

import {
  ClientAdapter,
  HttpMethod,
  RawHttpHeaders,
  RawHttpRequest,
  RawHttpResponse,
  RunnableOperation,
  SyncClientAdapter,
} from '@oats-ts/openapi-runtime'
import { OptionalRequestBodyRequest } from './requestTypes'
import { optionalRequestBodyResponseBodyValidator } from './responseBodyValidators'
import { OptionalRequestBodyResponse } from './responseTypes'

export async function optionalRequestBody(
  request: OptionalRequestBodyRequest,
  adapter: ClientAdapter,
): Promise<OptionalRequestBodyResponse> {
  const requestUrl = await adapter.getUrl('/optional-request-body', undefined)
  const requestHeaders = await adapter.getRequestHeaders(undefined, request.mimeType, undefined, undefined)
  const requestBody = await adapter.getRequestBody(request.mimeType, request.body)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await adapter.request(rawRequest)
  const mimeType = await adapter.getMimeType(rawResponse)
  const statusCode = await adapter.getStatusCode(rawResponse)
  const responseBody = await adapter.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    optionalRequestBodyResponseBodyValidator,
  )
  return {
    mimeType,
    statusCode,
    body: responseBody,
  } as OptionalRequestBodyResponse
}

export class OptionalRequestBodyOperation
  implements RunnableOperation<OptionalRequestBodyRequest, OptionalRequestBodyResponse>
{
  protected readonly adapter: SyncClientAdapter
  public constructor(adapter: SyncClientAdapter) {
    this.adapter = adapter
  }
  protected getUrl(_request: OptionalRequestBodyRequest): string {
    return this.adapter.getUrl('/optional-request-body', undefined)
  }
  protected getRequestMethod(_request: OptionalRequestBodyRequest): HttpMethod {
    return 'post'
  }
  protected getRequestBody(request: OptionalRequestBodyRequest): any {
    return this.adapter.getRequestBody(request.mimeType, request.body)
  }
  protected getRequestHeaders(request: OptionalRequestBodyRequest): RawHttpHeaders {
    return this.adapter.getRequestHeaders(undefined, request.mimeType, undefined, undefined)
  }
  protected getMimeType(response: RawHttpResponse): string | undefined {
    return this.adapter.getMimeType(response)
  }
  protected getStatusCode(response: RawHttpResponse): number | undefined {
    return this.adapter.getStatusCode(response)
  }
  protected getResponseBody(response: RawHttpResponse): any {
    return this.adapter.getResponseBody(
      response,
      this.getStatusCode(response),
      this.getMimeType(response),
      optionalRequestBodyResponseBodyValidator,
    )
  }
  public async run(request: OptionalRequestBodyRequest): Promise<OptionalRequestBodyResponse> {
    const rawRequest: RawHttpRequest = {
      url: this.getUrl(request),
      method: this.getRequestMethod(request),
      body: this.getRequestBody(request),
      headers: this.getRequestHeaders(request),
    }
    const rawResponse = await this.adapter.request(rawRequest)
    const typedResponse = {
      mimeType: this.getMimeType(rawResponse),
      statusCode: this.getStatusCode(rawResponse),
      body: this.getResponseBody(rawResponse),
    }
    return typedResponse as OptionalRequestBodyResponse
  }
}
