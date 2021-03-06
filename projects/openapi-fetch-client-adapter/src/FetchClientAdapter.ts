import MIMEType from 'whatwg-mimetype'
import * as crossFetch from 'cross-fetch'
import {
  RawHttpHeaders,
  RawHttpRequest,
  RawHttpResponse,
  ResponseHeadersDeserializers,
  ResponseBodyValidators,
  ClientAdapter,
} from '@oats-ts/openapi-http'
import { isFailure, Try } from '@oats-ts/try'
import { configure, ConfiguredValidator, DefaultConfig, stringify, Validator } from '@oats-ts/validators'

export type FetchClientAdapterConfig = {
  url?: string
  skipResponseValidation?: boolean
  options?: RequestInit
}

export class FetchClientAdapter implements ClientAdapter {
  private readonly config: FetchClientAdapterConfig

  constructor(config: FetchClientAdapterConfig = {}) {
    this.config = config
  }

  async request(request: RawHttpRequest): Promise<RawHttpResponse> {
    const response = await crossFetch.fetch(request.url, {
      ...(this.config.options ?? {}),
      headers: request.headers,
      method: request.method,
      ...(request.body === null || request.body === undefined ? {} : { body: request.body }),
    })

    const rawHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => (rawHeaders[key.toLowerCase()] = value))

    return {
      statusCode: response.status,
      headers: rawHeaders,
      body: await this.getParsedResponseBody(response),
    }
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

  protected configureResponseBodyValidator(validator: Validator<any>): ConfiguredValidator<any> {
    return configure(validator, 'responseBody', DefaultConfig)
  }

  async getPath<P>(input: P, serializer: (input: P) => Try<string>): Promise<string> {
    const path = serializer(input)
    if (isFailure(path)) {
      throw new Error(`Failed to serialize path:\n${path.issues.map(stringify).join('\n')}`)
    }
    return path.data
  }
  async getQuery<Q>(input: Q, serializer: (input: Q) => Try<string>): Promise<string | undefined> {
    const query = serializer(input)
    if (isFailure(query)) {
      throw new Error(`Failed to serialize query:\n${query.issues.map(stringify).join('\n')}`)
    }
    return query.data
  }
  async getUrl(path: string, query?: string): Promise<string> {
    const { url } = this.config
    return [typeof url !== 'string' ? '' : url, path, typeof query !== 'string' ? '' : query].join('')
  }
  async getRequestHeaders<H>(
    input?: H,
    mimeType?: string,
    serializer?: (input: any) => Try<RawHttpHeaders>,
  ): Promise<RawHttpHeaders> {
    const mimeTypeHeaders = {
      ...(typeof mimeType === 'string' ? { 'content-type': mimeType } : {}),
    }
    if (serializer === undefined || serializer === null || input === undefined || input === null) {
      return mimeTypeHeaders
    }
    const headers = serializer(input)
    if (isFailure(headers)) {
      throw new Error(`Failed to serialize request headers:\n${headers.issues.map(stringify).join('\n')}`)
    }
    return {
      ...headers.data,
      ...mimeTypeHeaders,
    }
  }
  async getRequestBody<B>(mimeType?: string, body?: B): Promise<any> {
    switch (mimeType) {
      case 'application/json':
        return JSON.stringify(body)
      default:
        return body
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
    const headers = deserializers[statusCode](response.headers)
    if (isFailure(headers)) {
      throw new Error(`Failed to deserialize response headers:\n${headers.issues.map(stringify).join('\n')}`)
    }
    return headers.data
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

      const validator = this.configureResponseBodyValidator(validatorsForStatus[mimeType])
      const issues = validator(response.body)
      if (issues.length !== 0) {
        throw new Error(issues.map(stringify).join('\n'))
      }
    }

    return response.body
  }
}
