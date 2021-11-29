import { RawHttpHeaders, RawHttpRequest, RawHttpResponse } from '@oats-ts/openapi-http'
import { AbstractClientConfiguration } from '../common/AbstractClientConfiguration'
import fetch, { Response } from 'node-fetch'

export class NodeFetchClientConfiguration extends AbstractClientConfiguration {
  async request(request: RawHttpRequest): Promise<RawHttpResponse> {
    const response = await fetch(request.url, {
      headers: request.headers,
      method: request.method,
      ...(request.body === null || request.body === undefined ? {} : { body: request.body }),
    })
    return {
      statusCode: response.status,
      headers: this.asRawHttpHeaders(response),
      body: this.getParsedResponseBody(response),
    }
  }

  protected asRawHttpHeaders(response: Response): RawHttpHeaders {
    const rawHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => (rawHeaders[key.toLowerCase()] = value))
    return rawHeaders
  }

  protected async getParsedResponseBody(response: Response): Promise<any> {
    if (typeof response.headers.get('content-type') !== 'string') {
      return undefined
    }
    const mimeType = response.headers.get('content-type') as string
    if (mimeType?.indexOf('application/json') >= 0) {
      return response.json()
    }
    if (mimeType?.indexOf('text/plain') >= 0) {
      return response.text()
    }
    return response.blob()
  }
}
