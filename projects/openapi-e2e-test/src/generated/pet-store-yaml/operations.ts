/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/pet-store-yaml.yaml
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
import { showPetByIdPathSerializer } from './pathSerializers'
import { listPetsQuerySerializer } from './querySerializers'
import { CreatePetsRequest, ListPetsRequest, ShowPetByIdRequest } from './requestTypes'
import {
  createPetsResponseBodyValidator,
  listPetsResponseBodyValidator,
  showPetByIdResponseBodyValidator,
} from './responseBodyValidators'
import { listPetsResponseHeadersDeserializer } from './responseHeaderDeserializers'
import { CreatePetsResponse, ListPetsResponse, ShowPetByIdResponse } from './responseTypes'

/**
 * Create a pet
 */
export async function createPets(request: CreatePetsRequest, adapter: ClientAdapter): Promise<CreatePetsResponse> {
  const requestUrl = await adapter.getUrl('/pets', undefined)
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
  const responseBody = await adapter.getResponseBody(rawResponse, statusCode, mimeType, createPetsResponseBodyValidator)
  return {
    mimeType,
    statusCode,
    body: responseBody,
  } as CreatePetsResponse
}

/**
 * List all pets
 */
export async function listPets(request: ListPetsRequest, adapter: ClientAdapter): Promise<ListPetsResponse> {
  const query = await adapter.getQuery(request.query, listPetsQuerySerializer)
  const requestUrl = await adapter.getUrl('/pets', query)
  const requestHeaders = await adapter.getRequestHeaders(undefined, undefined, undefined, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'get',
    headers: requestHeaders,
  }
  const rawResponse = await adapter.request(rawRequest)
  const mimeType = await adapter.getMimeType(rawResponse)
  const statusCode = await adapter.getStatusCode(rawResponse)
  const responseHeaders = await adapter.getResponseHeaders(rawResponse, statusCode, listPetsResponseHeadersDeserializer)
  const responseBody = await adapter.getResponseBody(rawResponse, statusCode, mimeType, listPetsResponseBodyValidator)
  return {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as ListPetsResponse
}

/**
 * Info for a specific pet
 */
export async function showPetById(request: ShowPetByIdRequest, adapter: ClientAdapter): Promise<ShowPetByIdResponse> {
  const path = await adapter.getPath(request.path, showPetByIdPathSerializer)
  const requestUrl = await adapter.getUrl(path, undefined)
  const requestHeaders = await adapter.getRequestHeaders(undefined, undefined, undefined, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'get',
    headers: requestHeaders,
  }
  const rawResponse = await adapter.request(rawRequest)
  const mimeType = await adapter.getMimeType(rawResponse)
  const statusCode = await adapter.getStatusCode(rawResponse)
  const responseBody = await adapter.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    showPetByIdResponseBodyValidator,
  )
  return {
    mimeType,
    statusCode,
    body: responseBody,
  } as ShowPetByIdResponse
}

/**
 * Create a pet
 */
export class CreatePetsOperation implements RunnableOperation<CreatePetsRequest, CreatePetsResponse> {
  protected readonly adapter: SyncClientAdapter
  public constructor(adapter: SyncClientAdapter) {
    this.adapter = adapter
  }
  protected getUrl(_request: CreatePetsRequest): string {
    return this.adapter.getUrl('/pets', undefined)
  }
  protected getRequestMethod(_request: CreatePetsRequest): HttpMethod {
    return 'post'
  }
  protected getRequestBody(request: CreatePetsRequest): any {
    return this.adapter.getRequestBody(request.mimeType, request.body)
  }
  protected getRequestHeaders(request: CreatePetsRequest): RawHttpHeaders {
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
      createPetsResponseBodyValidator,
    )
  }
  public async run(request: CreatePetsRequest): Promise<CreatePetsResponse> {
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
    return typedResponse as CreatePetsResponse
  }
}

/**
 * List all pets
 */
export class ListPetsOperation implements RunnableOperation<ListPetsRequest, ListPetsResponse> {
  protected readonly adapter: SyncClientAdapter
  public constructor(adapter: SyncClientAdapter) {
    this.adapter = adapter
  }
  protected getUrl(request: ListPetsRequest): string {
    const query = this.adapter.getQuery(request.query, listPetsQuerySerializer)
    return this.adapter.getUrl('/pets', query)
  }
  protected getRequestMethod(_request: ListPetsRequest): HttpMethod {
    return 'get'
  }
  protected getRequestHeaders(_request: ListPetsRequest): RawHttpHeaders {
    return this.adapter.getRequestHeaders(undefined, undefined, undefined, undefined)
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
      listPetsResponseBodyValidator,
    )
  }
  protected getResponseHeaders(response: RawHttpResponse): RawHttpHeaders {
    return this.adapter.getResponseHeaders(response, this.getStatusCode(response), listPetsResponseHeadersDeserializer)
  }
  public async run(request: ListPetsRequest): Promise<ListPetsResponse> {
    const rawRequest: RawHttpRequest = {
      url: this.getUrl(request),
      method: this.getRequestMethod(request),
      headers: this.getRequestHeaders(request),
    }
    const rawResponse = await this.adapter.request(rawRequest)
    const typedResponse = {
      mimeType: this.getMimeType(rawResponse),
      statusCode: this.getStatusCode(rawResponse),
      headers: this.getResponseHeaders(rawResponse),
      body: this.getResponseBody(rawResponse),
    }
    return typedResponse as ListPetsResponse
  }
}

/**
 * Info for a specific pet
 */
export class ShowPetByIdOperation implements RunnableOperation<ShowPetByIdRequest, ShowPetByIdResponse> {
  protected readonly adapter: SyncClientAdapter
  public constructor(adapter: SyncClientAdapter) {
    this.adapter = adapter
  }
  protected getUrl(request: ShowPetByIdRequest): string {
    const path = this.adapter.getPath(request.path, showPetByIdPathSerializer)
    return this.adapter.getUrl(path, undefined)
  }
  protected getRequestMethod(_request: ShowPetByIdRequest): HttpMethod {
    return 'get'
  }
  protected getRequestHeaders(_request: ShowPetByIdRequest): RawHttpHeaders {
    return this.adapter.getRequestHeaders(undefined, undefined, undefined, undefined)
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
      showPetByIdResponseBodyValidator,
    )
  }
  public async run(request: ShowPetByIdRequest): Promise<ShowPetByIdResponse> {
    const rawRequest: RawHttpRequest = {
      url: this.getUrl(request),
      method: this.getRequestMethod(request),
      headers: this.getRequestHeaders(request),
    }
    const rawResponse = await this.adapter.request(rawRequest)
    const typedResponse = {
      mimeType: this.getMimeType(rawResponse),
      statusCode: this.getStatusCode(rawResponse),
      body: this.getResponseBody(rawResponse),
    }
    return typedResponse as ShowPetByIdResponse
  }
}
