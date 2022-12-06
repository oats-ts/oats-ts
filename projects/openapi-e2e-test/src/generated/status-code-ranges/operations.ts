/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from edge-cases/status-code-ranges.json (originating from oats-ts/oats-schemas)
 */

import {
  ClientAdapter,
  HttpMethod,
  RawHttpHeaders,
  RawHttpRequest,
  RawHttpResponse,
  RunnableOperation,
} from '@oats-ts/openapi-runtime'
import {
  range1XxResponseBodyValidator,
  range2XxResponseBodyValidator,
  range3XxResponseBodyValidator,
  range4XxResponseBodyValidator,
  range5XxResponseBodyValidator,
  withNormalStatusesResponseBodyValidator,
} from './responseBodyValidators'
import {
  range1XxResponseHeaderParameters,
  range2XxResponseHeaderParameters,
  range3XxResponseHeaderParameters,
  range4XxResponseHeaderParameters,
  range5XxResponseHeaderParameters,
  withNormalStatusesResponseHeaderParameters,
} from './responseHeaderParameters'
import {
  Range1XxResponse,
  Range2XxResponse,
  Range3XxResponse,
  Range4XxResponse,
  Range5XxResponse,
  WithNormalStatusesResponse,
} from './responseTypes'

export class Range1XxOperation implements RunnableOperation<void, Range1XxResponse> {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  protected getUrl(): string {
    return this.adapter.getUrl('/1xx', undefined)
  }
  protected getHttpMethod(): HttpMethod {
    return 'get'
  }
  protected getRequestHeaders(): RawHttpHeaders {
    return this.adapter.getAuxiliaryRequestHeaders()
  }
  protected getMimeType(response: RawHttpResponse): string | undefined {
    return this.adapter.getMimeType(response)
  }
  protected getStatusCode(response: RawHttpResponse): number | undefined {
    return this.adapter.getStatusCode(response)
  }
  protected getResponseHeaders(response: RawHttpResponse): RawHttpHeaders {
    return this.adapter.getResponseHeaders(response, range1XxResponseHeaderParameters)
  }
  protected getResponseBody(response: RawHttpResponse): any {
    return this.adapter.getResponseBody(response, range1XxResponseBodyValidator)
  }
  public async run(): Promise<Range1XxResponse> {
    const rawRequest: RawHttpRequest = {
      url: this.getUrl(),
      method: this.getHttpMethod(),
      headers: this.getRequestHeaders(),
    }
    const rawResponse = await this.adapter.request(rawRequest)
    const typedResponse = {
      mimeType: this.getMimeType(rawResponse),
      statusCode: this.getStatusCode(rawResponse),
      headers: this.getResponseHeaders(rawResponse),
      body: this.getResponseBody(rawResponse),
    }
    return typedResponse as Range1XxResponse
  }
}

export class Range2XxOperation implements RunnableOperation<void, Range2XxResponse> {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  protected getUrl(): string {
    return this.adapter.getUrl('/2xx', undefined)
  }
  protected getHttpMethod(): HttpMethod {
    return 'get'
  }
  protected getRequestHeaders(): RawHttpHeaders {
    return this.adapter.getAuxiliaryRequestHeaders()
  }
  protected getMimeType(response: RawHttpResponse): string | undefined {
    return this.adapter.getMimeType(response)
  }
  protected getStatusCode(response: RawHttpResponse): number | undefined {
    return this.adapter.getStatusCode(response)
  }
  protected getResponseHeaders(response: RawHttpResponse): RawHttpHeaders {
    return this.adapter.getResponseHeaders(response, range2XxResponseHeaderParameters)
  }
  protected getResponseBody(response: RawHttpResponse): any {
    return this.adapter.getResponseBody(response, range2XxResponseBodyValidator)
  }
  public async run(): Promise<Range2XxResponse> {
    const rawRequest: RawHttpRequest = {
      url: this.getUrl(),
      method: this.getHttpMethod(),
      headers: this.getRequestHeaders(),
    }
    const rawResponse = await this.adapter.request(rawRequest)
    const typedResponse = {
      mimeType: this.getMimeType(rawResponse),
      statusCode: this.getStatusCode(rawResponse),
      headers: this.getResponseHeaders(rawResponse),
      body: this.getResponseBody(rawResponse),
    }
    return typedResponse as Range2XxResponse
  }
}

export class Range3XxOperation implements RunnableOperation<void, Range3XxResponse> {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  protected getUrl(): string {
    return this.adapter.getUrl('/3xx', undefined)
  }
  protected getHttpMethod(): HttpMethod {
    return 'get'
  }
  protected getRequestHeaders(): RawHttpHeaders {
    return this.adapter.getAuxiliaryRequestHeaders()
  }
  protected getMimeType(response: RawHttpResponse): string | undefined {
    return this.adapter.getMimeType(response)
  }
  protected getStatusCode(response: RawHttpResponse): number | undefined {
    return this.adapter.getStatusCode(response)
  }
  protected getResponseHeaders(response: RawHttpResponse): RawHttpHeaders {
    return this.adapter.getResponseHeaders(response, range3XxResponseHeaderParameters)
  }
  protected getResponseBody(response: RawHttpResponse): any {
    return this.adapter.getResponseBody(response, range3XxResponseBodyValidator)
  }
  public async run(): Promise<Range3XxResponse> {
    const rawRequest: RawHttpRequest = {
      url: this.getUrl(),
      method: this.getHttpMethod(),
      headers: this.getRequestHeaders(),
    }
    const rawResponse = await this.adapter.request(rawRequest)
    const typedResponse = {
      mimeType: this.getMimeType(rawResponse),
      statusCode: this.getStatusCode(rawResponse),
      headers: this.getResponseHeaders(rawResponse),
      body: this.getResponseBody(rawResponse),
    }
    return typedResponse as Range3XxResponse
  }
}

export class Range4XxOperation implements RunnableOperation<void, Range4XxResponse> {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  protected getUrl(): string {
    return this.adapter.getUrl('/4xx', undefined)
  }
  protected getHttpMethod(): HttpMethod {
    return 'get'
  }
  protected getRequestHeaders(): RawHttpHeaders {
    return this.adapter.getAuxiliaryRequestHeaders()
  }
  protected getMimeType(response: RawHttpResponse): string | undefined {
    return this.adapter.getMimeType(response)
  }
  protected getStatusCode(response: RawHttpResponse): number | undefined {
    return this.adapter.getStatusCode(response)
  }
  protected getResponseHeaders(response: RawHttpResponse): RawHttpHeaders {
    return this.adapter.getResponseHeaders(response, range4XxResponseHeaderParameters)
  }
  protected getResponseBody(response: RawHttpResponse): any {
    return this.adapter.getResponseBody(response, range4XxResponseBodyValidator)
  }
  public async run(): Promise<Range4XxResponse> {
    const rawRequest: RawHttpRequest = {
      url: this.getUrl(),
      method: this.getHttpMethod(),
      headers: this.getRequestHeaders(),
    }
    const rawResponse = await this.adapter.request(rawRequest)
    const typedResponse = {
      mimeType: this.getMimeType(rawResponse),
      statusCode: this.getStatusCode(rawResponse),
      headers: this.getResponseHeaders(rawResponse),
      body: this.getResponseBody(rawResponse),
    }
    return typedResponse as Range4XxResponse
  }
}

export class Range5XxOperation implements RunnableOperation<void, Range5XxResponse> {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  protected getUrl(): string {
    return this.adapter.getUrl('/5xx', undefined)
  }
  protected getHttpMethod(): HttpMethod {
    return 'get'
  }
  protected getRequestHeaders(): RawHttpHeaders {
    return this.adapter.getAuxiliaryRequestHeaders()
  }
  protected getMimeType(response: RawHttpResponse): string | undefined {
    return this.adapter.getMimeType(response)
  }
  protected getStatusCode(response: RawHttpResponse): number | undefined {
    return this.adapter.getStatusCode(response)
  }
  protected getResponseHeaders(response: RawHttpResponse): RawHttpHeaders {
    return this.adapter.getResponseHeaders(response, range5XxResponseHeaderParameters)
  }
  protected getResponseBody(response: RawHttpResponse): any {
    return this.adapter.getResponseBody(response, range5XxResponseBodyValidator)
  }
  public async run(): Promise<Range5XxResponse> {
    const rawRequest: RawHttpRequest = {
      url: this.getUrl(),
      method: this.getHttpMethod(),
      headers: this.getRequestHeaders(),
    }
    const rawResponse = await this.adapter.request(rawRequest)
    const typedResponse = {
      mimeType: this.getMimeType(rawResponse),
      statusCode: this.getStatusCode(rawResponse),
      headers: this.getResponseHeaders(rawResponse),
      body: this.getResponseBody(rawResponse),
    }
    return typedResponse as Range5XxResponse
  }
}

export class WithNormalStatusesOperation implements RunnableOperation<void, WithNormalStatusesResponse> {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  protected getUrl(): string {
    return this.adapter.getUrl('/with-normal-statuses', undefined)
  }
  protected getHttpMethod(): HttpMethod {
    return 'get'
  }
  protected getRequestHeaders(): RawHttpHeaders {
    return this.adapter.getAuxiliaryRequestHeaders()
  }
  protected getMimeType(response: RawHttpResponse): string | undefined {
    return this.adapter.getMimeType(response)
  }
  protected getStatusCode(response: RawHttpResponse): number | undefined {
    return this.adapter.getStatusCode(response)
  }
  protected getResponseHeaders(response: RawHttpResponse): RawHttpHeaders {
    return this.adapter.getResponseHeaders(response, withNormalStatusesResponseHeaderParameters)
  }
  protected getResponseBody(response: RawHttpResponse): any {
    return this.adapter.getResponseBody(response, withNormalStatusesResponseBodyValidator)
  }
  public async run(): Promise<WithNormalStatusesResponse> {
    const rawRequest: RawHttpRequest = {
      url: this.getUrl(),
      method: this.getHttpMethod(),
      headers: this.getRequestHeaders(),
    }
    const rawResponse = await this.adapter.request(rawRequest)
    const typedResponse = {
      mimeType: this.getMimeType(rawResponse),
      statusCode: this.getStatusCode(rawResponse),
      headers: this.getResponseHeaders(rawResponse),
      body: this.getResponseBody(rawResponse),
    }
    return typedResponse as WithNormalStatusesResponse
  }
}