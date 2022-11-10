import {
  HttpMethod,
  RawHttpHeaders,
  RawHttpRequest,
  RawHttpResponse,
  RunnableOperation,
  SyncClientAdapter,
} from '@oats-ts/openapi-http'
import { CreatePetsRequest } from './generated/pet-store-json/requestTypes'
import { CreatePetsResponse } from './generated/pet-store-json/responseTypes'
import { Error, Pet } from './generated/pet-store-json/types'

export class CreatePetsOperation implements RunnableOperation<CreatePetsRequest, CreatePetsResponse> {
  protected readonly adapter: SyncClientAdapter

  constructor(adapter: SyncClientAdapter) {
    this.adapter = adapter
  }

  protected getUrl(_request: CreatePetsRequest): string {
    return this.adapter.getUrl('/pets', undefined)
  }

  protected getRequestHeaders(_request: CreatePetsRequest): RawHttpHeaders {
    throw new Error('Method not implemented.')
  }

  protected getRequestBody(_request: CreatePetsRequest): unknown {
    throw new Error('Method not implemented.')
  }

  protected getRequestMethod(_request: CreatePetsRequest): HttpMethod {
    return 'post'
  }

  protected getStatusCode(_response: RawHttpResponse): number {
    throw new Error('Method not implemented.')
  }

  protected getMimeType(_response: RawHttpResponse): string {
    throw new Error('Method not implemented.')
  }

  protected getResponseBody(_response: RawHttpResponse): Pet | Error {
    throw new Error('Method not implemented.')
  }

  protected getResponseHeaders<T>(_response: RawHttpResponse): T {
    throw new Error('Method not implemented.')
  }

  async run(request: CreatePetsRequest): Promise<CreatePetsResponse> {
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
