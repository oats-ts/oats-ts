import MIMEType from 'whatwg-mimetype'
import * as crossFetch from 'cross-fetch'
import {
  RawHttpHeaders,
  RawHttpRequest,
  RawHttpResponse,
  ResponseHeadersDeserializers,
  ResponseBodyValidators,
  ClientAdapter,
  Cookies,
} from '@oats-ts/openapi-http'
import { isFailure, Try } from '@oats-ts/try'
import { configure, ConfiguredValidator, DefaultConfig, stringify, Validator } from '@oats-ts/validators'

export type FetchClientAdapterConfig = {
  url?: string
  skipResponseValidation?: boolean
}

export class FetchClientAdapter implements ClientAdapter {
  private readonly config: FetchClientAdapterConfig

  public constructor(config: FetchClientAdapterConfig = {}) {
    this.config = config
  }

  public async getCookies<C>(
    input?: C | undefined,
    serializer?: ((input: C) => Try<string>) | undefined,
  ): Promise<string | undefined> {
    if (input === null || input === undefined || serializer === null || serializer === undefined) {
      return undefined
    }
    const cookie = serializer(input)
    if (isFailure(cookie)) {
      throw new Error(`Failed to serialize cookie:\n${cookie.issues.map(stringify).join('\n')}`)
    }
    return cookie.data
  }

  public async getResponseCookies<C>(
    response: RawHttpResponse,
    deserializer?: (cookie?: string) => Try<Cookies<C>>,
  ): Promise<Cookies<C> | undefined> {
    if (deserializer === null || deserializer === undefined) {
      return undefined
    }
    const header = response?.headers?.['set-cookie']
    if (header === undefined || header === null) {
      return undefined
    }
    const cookie = deserializer(header)
    if (isFailure(cookie)) {
      throw new Error(`Failed to parse set-cookie:\n${cookie.issues.map(stringify).join('\n')}`)
    }
    return cookie.data
  }

  public async request(request: RawHttpRequest): Promise<RawHttpResponse> {
    const response = await crossFetch.fetch(request.url, this.getRequestInit(request))
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

  public async getPath<P>(input: P, serializer: (input: P) => Try<string>): Promise<string> {
    const path = serializer(input)
    if (isFailure(path)) {
      throw new Error(`Failed to serialize path:\n${path.issues.map(stringify).join('\n')}`)
    }
    return path.data
  }

  public async getQuery<Q>(input?: Q, serializer?: (input: Q) => Try<string>): Promise<string | undefined> {
    if (input === undefined || input === null || serializer === undefined || serializer === null) {
      return undefined
    }
    const query = serializer(input)
    if (isFailure(query)) {
      throw new Error(`Failed to serialize query:\n${query.issues.map(stringify).join('\n')}`)
    }
    return query.data
  }

  public async getUrl(path: string, query?: string): Promise<string> {
    const { url } = this.config
    return [typeof url !== 'string' ? '' : url, path, typeof query !== 'string' ? '' : query].join('')
  }

  public async getRequestHeaders<H>(
    input?: H,
    mimeType?: string,
    cookie?: string,
    serializer?: (input: any) => Try<RawHttpHeaders>,
  ): Promise<RawHttpHeaders> {
    const baseHeaders = {
      ...(typeof mimeType === 'string' ? { 'content-type': mimeType } : {}),
      ...(cookie === null || cookie === undefined ? {} : { cookie }),
    }
    if (serializer === undefined || serializer === null || input === undefined || input === null) {
      return baseHeaders
    }
    const headers = serializer(input)
    if (isFailure(headers)) {
      throw new Error(`Failed to serialize request headers:\n${headers.issues.map(stringify).join('\n')}`)
    }
    return {
      ...headers.data,
      ...baseHeaders,
    }
  }
  public async getRequestBody<B>(mimeType?: string, body?: B): Promise<any> {
    switch (mimeType) {
      case 'application/json':
        return JSON.stringify(body)
      default:
        return body
    }
  }

  public async getStatusCode(response: RawHttpResponse): Promise<number | undefined> {
    return response.statusCode
  }

  public async getMimeType(response: RawHttpResponse): Promise<string | undefined> {
    const mimeType = response.headers?.['content-type']
    return typeof mimeType === 'string' ? new MIMEType(mimeType).essence : undefined
  }

  public async getResponseHeaders(
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

  public async getResponseBody(
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

  protected getRequestInit(request: RawHttpRequest): RequestInit | undefined {
    return {
      headers: request.headers,
      /**
       * It's important to uppercase this. In most cases it's irrelevant,
       * but for PATCH only the uppercase variant goes through properly.
       */
      method: request.method.toUpperCase(),
      ...(request.body === null || request.body === undefined ? {} : { body: request.body }),
    }
  }
}
