import MIMEType from 'whatwg-mimetype'
import * as crossFetch from 'cross-fetch'
import {
  TypedHttpRequest,
  RawHttpHeaders,
  RawHttpRequest,
  RawHttpResponse,
  ResponseHeadersDeserializers,
  ResponseBodyValidators,
  ClientAdapter,
} from '@oats-ts/openapi-http'
import { fluent, Try } from '@oats-ts/try'
import { configure, stringify } from '@oats-ts/validators'

export type FetchClientAdapterConfig = {
  url?: string
  skipResponseValidation?: boolean
}

export class FetchClientAdapter implements ClientAdapter {
  private readonly config: FetchClientAdapterConfig

  constructor(config: FetchClientAdapterConfig = {}) {
    this.config = config
  }

  async request(request: RawHttpRequest): Promise<RawHttpResponse> {
    const response = await crossFetch.fetch(request.url, {
      headers: request.headers,
      method: request.method,
      ...(request.body === null || request.body === undefined ? {} : { body: request.body }),
    })
    return {
      statusCode: response.status,
      headers: this.asRawHttpHeaders(response),
      body: await this.getParsedResponseBody(response),
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

  async getPath(input: Partial<TypedHttpRequest>, serializer: (input: any) => Try<string>): Promise<string> {
    return fluent(serializer(input.path)).getData()
  }
  async getQuery(
    input: Partial<TypedHttpRequest>,
    serializer: (input: any) => Try<string>,
  ): Promise<string | undefined> {
    // There are no query parameters, no query string returned by this
    if (serializer === undefined || serializer === null) {
      return undefined
    }
    return fluent(serializer(input.query)).getData()
  }
  async getUrl(path: string, query?: string): Promise<string> {
    const { url } = this.config
    return [typeof url !== 'string' ? '' : url, path, typeof query !== 'string' ? '' : query].join('')
  }
  async getRequestHeaders(
    input?: Partial<TypedHttpRequest>,
    serializer?: (input: any) => Try<RawHttpHeaders>,
  ): Promise<RawHttpHeaders> {
    return {
      ...(serializer === undefined || serializer === null || input === undefined || input === null
        ? {}
        : fluent(serializer(input.headers)).getData()),
      ...(typeof input?.mimeType === 'string' ? { 'content-type': input.mimeType } : {}),
    }
  }
  async getRequestBody(input: Partial<TypedHttpRequest>): Promise<any> {
    if (typeof input.mimeType !== 'string') {
      return undefined
    }
    switch (input.mimeType) {
      case 'application/json':
        return JSON.stringify(input.body)
      default:
        return input.body
    }
  }
  async getStatusCode(response: RawHttpResponse): Promise<number | undefined> {
    return response.statusCode
  }
  async getMimeType(response: RawHttpResponse): Promise<string | undefined> {
    const mimeType = response.headers?.['content-type']
    return typeof mimeType === 'string' ? new MIMEType(mimeType).essence : undefined
  }
  async getResponseHeaders(
    response: RawHttpResponse,
    statusCode?: number,
    deserializers?: ResponseHeadersDeserializers,
  ): Promise<any> {
    if (deserializers === null || deserializers === undefined) {
      return undefined
    }
    if (typeof statusCode !== 'number' || typeof deserializers[statusCode] !== 'function') {
      const statusCodes = Object.keys(deserializers)
      const mimeTypesHint =
        statusCodes.length === 1
          ? `Expected "${statusCodes[0]}".`
          : `Expected one of ${statusCodes.map((type) => `"${type}"`).join(',')}`
      throw new Error(`Unexpected status code : ${statusCode}. ${mimeTypesHint}`)
    }
    if (response.headers === null || response.headers === undefined) {
      throw new Error(`Response headers should not be ${response.headers}`)
    }
    return fluent(deserializers[statusCode](response.headers)).getData()
  }
  async getResponseBody(
    response: RawHttpResponse,
    statusCode?: number,
    mimeType?: string,
    validators?: ResponseBodyValidators,
  ): Promise<any> {
    // If expectations not provided, return undefined, nothing to validate.
    if (validators === null || validators === undefined) {
      return undefined
    }

    if (typeof statusCode !== 'number') {
      throw new Error(`Status code should not be ${statusCode}`)
    }
    const { skipResponseValidation } = this.config

    if (!skipResponseValidation) {
      const validatorsForStatus = validators[statusCode] || validators.default

      // In case the status code returned by the server was not found among the expectations, throw.
      if (validatorsForStatus === undefined || validatorsForStatus === null) {
        const statusCodes = Object.keys(validators)
        const statusCodesHint =
          statusCodes.length === 1
            ? `Expected "${statusCodes[0]}".`
            : `Expected one of ${statusCodes.map((code) => `"${code}"`).join(',')}`
        throw new Error(`Unexpected status code: "${statusCode}". ${statusCodesHint}`)
      }

      // In case the mime type returned by the server was not found amount expectations, throw.
      if (typeof mimeType !== 'string' || typeof validatorsForStatus[mimeType] !== 'function') {
        const mimeTypes = Object.keys(validatorsForStatus)
        const mimeTypesHint =
          mimeTypes.length === 1
            ? `Expected "${mimeTypes[0]}".`
            : `Expected one of ${mimeTypes.map((type) => `"${type}"`).join(',')}`
        throw new Error(`Unexpected mime type: "${mimeType}". ${mimeTypesHint}`)
      }

      const validator = configure(validatorsForStatus[mimeType], 'responseBody')
      const issues = validator(response.body)
      if (issues.length !== 0) {
        throw new Error(issues.map(stringify).join('\n'))
      }
    }

    return response.body
  }
}
