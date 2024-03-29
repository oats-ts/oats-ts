import MIMEType from 'whatwg-mimetype'
import * as crossFetch from 'cross-fetch'
import {
  RawHttpHeaders,
  RawHttpRequest,
  RawHttpResponse,
  ResponseBodyValidators,
  ClientAdapter,
  SetCookieValue,
  ResponseHeadersParameters,
} from '@oats-ts/openapi-http'
import { isFailure } from '@oats-ts/try'
import { configure, ConfiguredValidator, DefaultConfig, stringify, Validator } from '@oats-ts/validators'
import {
  DefaultCookieSerializer,
  DefaultHeaderDeserializer,
  DefaultHeaderSerializer,
  DefaultPathSerializer,
  DefaultQuerySerializer,
  deserializeSetCookie,
} from '@oats-ts/openapi-parameter-serialization'
import { FetchClientAdapterConfig } from './typings'

export class FetchClientAdapter implements ClientAdapter {
  private readonly config: FetchClientAdapterConfig

  public constructor(config: FetchClientAdapterConfig = {}) {
    this.config = config
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

  public getPath<P>(input: P, descriptor: any): string {
    const path = new DefaultPathSerializer(descriptor).serialize(input)
    if (isFailure(path)) {
      throw new Error(`Failed to serialize path:\n${path.issues.map(stringify).join('\n')}`)
    }
    return path.data
  }

  public getQuery<Q>(input?: Q, descriptor?: any): string | undefined {
    if (input === undefined || input === null || descriptor === undefined || descriptor === null) {
      return undefined
    }
    const query = new DefaultQuerySerializer(descriptor).serialize(input)
    if (isFailure(query)) {
      throw new Error(`Failed to serialize query:\n${query.issues.map(stringify).join('\n')}`)
    }
    return query.data
  }

  public getUrl(path: string, query?: string): string {
    const { url } = this.config
    return [typeof url !== 'string' ? '' : url, path, typeof query !== 'string' ? '' : query].join('')
  }

  public getCookieBasedRequestHeaders<C>(input: C, serializer: any): RawHttpHeaders {
    const cookie = new DefaultCookieSerializer(serializer).serialize(input)
    if (isFailure(cookie)) {
      throw new Error(`Failed to serialize cookie:\n${cookie.issues.map(stringify).join('\n')}`)
    }
    return cookie.data === undefined || cookie.data === null ? {} : { cookie: cookie.data }
  }

  public getParameterBasedRequestHeaders<H>(input: H, descriptor: any): RawHttpHeaders {
    const headers = new DefaultHeaderSerializer(descriptor).serialize(input)
    if (isFailure(headers)) {
      throw new Error(`Failed to serialize request headers:\n${headers.issues.map(stringify).join('\n')}`)
    }
    return headers.data
  }

  public getMimeTypeBasedRequestHeaders(mimeType?: string): RawHttpHeaders {
    if (mimeType === undefined || mimeType === null) {
      return {}
    }
    return { 'content-type': mimeType }
  }

  public getAuxiliaryRequestHeaders(): RawHttpHeaders {
    return {}
  }

  public getRequestBody<B>(mimeType?: string, body?: B): any {
    switch (mimeType) {
      case 'application/json':
        return JSON.stringify(body)
      default:
        return body
    }
  }

  public getStatusCode(response: RawHttpResponse): number | undefined {
    return response.statusCode
  }

  public getMimeType(response: RawHttpResponse): string | undefined {
    const mimeType = response.headers?.['content-type']
    return typeof mimeType === 'string' ? new MIMEType(mimeType).essence : undefined
  }

  protected getParsedResponseBody(_response: any): any {
    // So the Response type doesn't leak out into the definition
    const response = _response as Response
    if (typeof response.headers.get('content-type') !== 'string') {
      return undefined
    }
    const mimeType = response.headers.get('content-type') as string
    if (mimeType?.indexOf('application/json') >= 0) {
      return response.json()
    }
    // TODO this will try to turn binary to text too, might need to consider common binary mime types.
    return response.text()
  }

  protected configureResponseBodyValidator(validator: Validator<any>): ConfiguredValidator<any> {
    return configure(validator, 'responseBody', DefaultConfig)
  }

  public getResponseCookies(response: RawHttpResponse): SetCookieValue[] {
    const header = response?.headers?.['set-cookie']
    if (header === undefined || header === null) {
      return []
    }
    const cookie = deserializeSetCookie(header, "headers['set-cookie']")
    if (isFailure(cookie)) {
      throw new Error(`Failed to parse the set-cookie header:\n${cookie.issues.map(stringify).join('\n')}`)
    }
    return cookie.data
  }

  public getResponseBody(response: RawHttpResponse, validators?: ResponseBodyValidators): any {
    // If expectations not provided, return undefined, nothing to validate.
    if (validators === null || validators === undefined) {
      return undefined
    }
    const { statusCode } = response
    const mimeType = this.getMimeType(response)

    if (typeof statusCode !== 'number') {
      throw new Error(`Status code should not be ${statusCode}`)
    }
    const { skipResponseValidation } = this.config

    if (!skipResponseValidation) {
      const validatorsForStatus =
        validators[statusCode] ?? validators[this.getStatusCodeRange(statusCode)] ?? validators.default

      // In case the status code returned by the server was not found among the expectations, throw.
      if (validatorsForStatus === undefined || validatorsForStatus === null) {
        const statusCodes = Object.keys(validators)
        const statusCodesHint =
          statusCodes.length === 1
            ? `Expected "${statusCodes[0]}".`
            : `Expected one of ${statusCodes.map((code) => `${code}`).join(',')}`
        throw new Error(`Unexpected status code: "${statusCode}". ${statusCodesHint} (body: ${response.body})`)
      }

      // In case the mime type returned by the server was not found amount expectations, throw.
      if (typeof mimeType !== 'string' || typeof validatorsForStatus[mimeType] !== 'function') {
        const mimeTypes = Object.keys(validatorsForStatus)
        const mimeTypesHint =
          mimeTypes.length === 1
            ? `Expected "${mimeTypes[0]}".`
            : `Expected one of ${mimeTypes.map((type) => `"${type}"`).join(',')}`
        throw new Error(`Unexpected mime type: "${mimeType}". ${mimeTypesHint} (body: ${response.body})`)
      }

      const validator = this.configureResponseBodyValidator(validatorsForStatus[mimeType])
      const issues = validator(response.body)
      if (issues.length !== 0) {
        throw new Error(issues.map(stringify).join('\n'))
      }
    }

    return response.body
  }

  protected getStatusCodeRange(statusCode: number): string {
    const str = statusCode.toString(10)
    return `${str[0]}XX`
  }

  public getResponseHeaders(response: RawHttpResponse, descriptors?: ResponseHeadersParameters): any {
    if (descriptors === null || descriptors === undefined) {
      return undefined
    }
    const { statusCode } = response
    if (statusCode === null || statusCode === undefined) {
      throw new Error(`Status code should not be ${statusCode}`)
    }

    const descriptor =
      descriptors[statusCode] ?? descriptors[this.getStatusCodeRange(statusCode)] ?? descriptors.default
    if (descriptor === undefined || descriptor === null) {
      const statusCodes = Object.keys(descriptors)
      const mimeTypesHint =
        statusCodes.length === 1
          ? `Expected "${statusCodes[0]}".`
          : `Expected one of ${statusCodes.map((type) => `${type}`).join(',')}`
      throw new Error(`Unexpected status code: ${statusCode}. ${mimeTypesHint} (body: ${response.body})`)
    }
    if (response.headers === null || response.headers === undefined) {
      throw new Error(`Response headers should not be ${response.headers} (body: ${response.body})`)
    }
    const headers = new DefaultHeaderDeserializer(descriptor).deserialize(response.headers)
    if (isFailure(headers)) {
      throw new Error(`Failed to deserialize response headers:\n${headers.issues.map(stringify).join('\n')}`)
    }
    return headers.data
  }

  protected getRequestInit(request: RawHttpRequest): any | undefined {
    // Using any here, so the RequestInit type doesn't leak out into the definition
    const init: RequestInit = {
      headers: request.headers,
      /**
       * It's important to uppercase this. In most cases it's irrelevant,
       * but for PATCH only the uppercase variant goes through properly.
       */
      method: request.method.toUpperCase(),
      ...(request.body === null || request.body === undefined ? {} : { body: request.body }),
    }
    return init
  }
}
