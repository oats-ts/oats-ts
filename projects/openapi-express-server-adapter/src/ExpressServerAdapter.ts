import {
  RawHttpHeaders,
  HttpResponse,
  RawHttpResponse,
  RequestBodyValidators,
  ServerAdapter,
  HttpMethod,
  OperationCorsConfiguration,
  SetCookieValue,
  ResponseHeadersParameters,
  StatusCodeRange,
} from '@oats-ts/openapi-http'
import { failure, isFailure, success, Try } from '@oats-ts/try'
import { stringify, Validator, Schema } from '@oats-ts/validators'
import {
  DefaultCookieDeserializer,
  DefaultHeaderDeserializer,
  DefaultHeaderSerializer,
  DefaultPathDeserializer,
  DefaultQueryDeserializer,
  serializeSetCookieValue,
} from '@oats-ts/openapi-parameter-serialization'
import { ExpressToolkit } from './typings'
import MIMEType from 'whatwg-mimetype'

export class ExpressServerAdapter implements ServerAdapter<ExpressToolkit> {
  protected configureRequestBodyValidator(validator: Schema): Validator {
    return new Validator(validator, 'requestBody')
  }

  public async getPathParameters<P>(toolkit: ExpressToolkit, descriptor: any): Promise<Try<P>> {
    return new DefaultPathDeserializer<P>(descriptor).deserialize(toolkit.request.url)
  }

  public async getQueryParameters<Q>(toolkit: ExpressToolkit, descriptor: any): Promise<Try<Q>> {
    return new DefaultQueryDeserializer<Q>(descriptor).deserialize(
      new URL(toolkit.request.url, 'http://test.com').search,
    )
  }

  public async getCookieParameters<C>(toolkit: ExpressToolkit, descriptor: any): Promise<Try<C>> {
    return new DefaultCookieDeserializer<C>(descriptor).deserialize(toolkit.request.header('cookie') ?? '')
  }

  public async getRequestHeaders<H>(toolkit: ExpressToolkit, descriptor: any): Promise<Try<H>> {
    return new DefaultHeaderDeserializer<H>(descriptor).deserialize(toolkit.request.headers as RawHttpHeaders)
  }

  public async getMimeType<M extends string>(toolkit: ExpressToolkit): Promise<M> {
    const mimeType = toolkit.request.header('Content-Type')
    if (mimeType === null || mimeType === undefined) {
      return undefined as unknown as M
    }
    return new MIMEType(mimeType).essence as M
  }

  public async getRequestBody<M extends string, B>(
    toolkit: ExpressToolkit,
    required: boolean,
    mimeType: M | undefined,
    validators: RequestBodyValidators<M>,
  ): Promise<Try<B>> {
    // No mimetype means we can only pass if the request body is not required.
    if (mimeType === null || mimeType === undefined) {
      if (!required) {
        return success(undefined as unknown as B)
      }
      return failure({
        message: `missing "content-type" header`,
        severity: 'error',
        path: 'headers',
      })
    }
    if (validators[mimeType] === null || validators[mimeType] === undefined) {
      const contentTypes = Object.keys(validators)
      const expectedContentTypes =
        contentTypes.length === 1 ? `"${contentTypes[0]}"` : `one of ${contentTypes.map((ct) => `"${ct}"`).join(', ')}`
      return failure({
        message: `"content-type" should be ${expectedContentTypes}`,
        severity: 'error',
        path: 'headers',
      })
    }
    const validator = this.configureRequestBodyValidator(validators[mimeType])
    const issues = validator.validate(toolkit.request.body)
    return issues.length > 0 ? failure(...issues) : success(toolkit.request.body as B)
  }

  public async getStatusCode(input: ExpressToolkit, response: HttpResponse): Promise<number> {
    return response.statusCode
  }

  protected getStatusCodeRange(statusCode: number): StatusCodeRange | 'default' {
    if (statusCode >= 100 && statusCode < 200) {
      return '1XX'
    }
    if (statusCode >= 200 && statusCode < 300) {
      return '2XX'
    }
    if (statusCode >= 300 && statusCode < 400) {
      return '3XX'
    }
    if (statusCode >= 400 && statusCode < 500) {
      return '4XX'
    }
    if (statusCode >= 500 && statusCode < 600) {
      return '5XX'
    }
    return 'default'
  }

  public async getResponseBody(input: ExpressToolkit, response: HttpResponse): Promise<any> {
    if (response.body === null || response.body === undefined) {
      return undefined
    }
    switch (response.mimeType) {
      case 'application/json':
        return JSON.stringify(response.body)
      case 'text/plain':
        return `${response.body}`
      default:
        return response.body
    }
  }

  public getAccessControlRequestedMethod({ request }: ExpressToolkit): HttpMethod | undefined {
    return request.header('access-control-request-method')?.toLowerCase() as HttpMethod | undefined
  }

  protected isMatchingHttpMethod(allowed?: HttpMethod[], method?: HttpMethod): method is HttpMethod {
    if (method === null || method === undefined || allowed === null || allowed === undefined) {
      return false
    }
    return allowed.includes(method)
  }

  protected isMatchingOrigin(allowed?: string[] | boolean, origin?: string): boolean {
    if (typeof allowed === 'boolean') {
      return allowed
    }
    if (origin === null || origin === undefined || allowed === null || allowed === undefined) {
      return false
    }
    return allowed.includes(origin)
  }

  public async getPreflightCorsHeaders(
    toolkit: ExpressToolkit,
    method: HttpMethod | undefined,
    cors: OperationCorsConfiguration | undefined = {},
  ): Promise<RawHttpHeaders> {
    const {
      allowedOrigins,
      allowedRequestHeaders = [],
      allowedResponseHeaders = [],
      allowCredentials,
      maxAge,
    } = cors ?? {}

    const origin = toolkit.request.header('origin')
    const requestedHeaders = (toolkit.request.header('access-control-request-headers') ?? '')
      .split(',')
      .map((header) => header.trim().toLowerCase())

    if (method === undefined || method === null || !this.isMatchingOrigin(allowedOrigins, origin)) {
      return {}
    }

    const corsHeaders: RawHttpHeaders = {
      'access-control-allow-origin': origin ?? '*',
      'access-control-allow-methods': method?.toUpperCase(),
    }

    if (Array.isArray(requestedHeaders) && requestedHeaders.length > 0) {
      const requestHeaders = requestedHeaders.filter((header) => allowedRequestHeaders.includes(header))
      if (requestHeaders.length > 0) {
        corsHeaders['access-control-allow-headers'] = requestHeaders.join(', ')
      }
    }

    if (allowedResponseHeaders.length > 0) {
      corsHeaders['access-control-expose-headers'] = allowedResponseHeaders.join(', ')
    }

    if (maxAge !== undefined) {
      corsHeaders['access-control-max-age'] = maxAge.toString(10)
    }

    if (allowCredentials !== undefined) {
      corsHeaders['access-control-allow-credentials'] = allowCredentials.toString()
    }

    return corsHeaders
  }

  public async getCorsHeaders(
    toolkit: ExpressToolkit,
    cors: OperationCorsConfiguration | undefined,
  ): Promise<RawHttpHeaders> {
    const { allowedOrigins, allowedResponseHeaders = [], allowCredentials } = cors ?? {}
    const origin = toolkit.request.header('origin')

    if (!this.isMatchingOrigin(allowedOrigins, origin)) {
      return {}
    }

    const corsHeaders: RawHttpHeaders = { 'access-control-allow-origin': origin ?? '*' }
    if (allowedResponseHeaders.length > 0) {
      corsHeaders['access-control-expose-headers'] = allowedResponseHeaders.join(', ')
    }
    if (allowCredentials !== undefined) {
      corsHeaders['access-control-allow-credentials'] = allowCredentials.toString()
    }
    return corsHeaders
  }

  public async getResponseHeaders(
    _toolkit: ExpressToolkit,
    response: HttpResponse,
    descriptors?: ResponseHeadersParameters,
    corsHeaders?: RawHttpHeaders,
  ): Promise<RawHttpHeaders> {
    const baseHeaders: RawHttpHeaders = {
      ...(corsHeaders ?? {}),
      ...(response.mimeType === null || response.mimeType === undefined ? {} : { 'content-type': response.mimeType }),
    }

    if (descriptors === null || descriptors === undefined) {
      return baseHeaders
    }
    const descriptor = descriptors[response.statusCode] ?? descriptors[this.getStatusCodeRange(response.statusCode)]
    if (descriptor === null || descriptor === undefined) {
      return baseHeaders
    }
    const headers = new DefaultHeaderSerializer(descriptor).serialize(response.headers)
    if (isFailure(headers)) {
      throw new Error(`Failed to serialize response headers:\n${headers.issues.map(stringify).join('\n')}`)
    }
    return {
      ...headers.data,
      ...baseHeaders,
    }
  }

  public async getResponseCookies(toolkit: ExpressToolkit, resp: HttpResponse): Promise<SetCookieValue[]> {
    return resp.cookies ?? []
  }

  public async respond(toolkit: ExpressToolkit, rawResponse: RawHttpResponse): Promise<void> {
    if (typeof rawResponse.statusCode === 'number') {
      toolkit.response.status(rawResponse.statusCode)
    }
    if (rawResponse.headers !== null && rawResponse.headers !== undefined && !toolkit.response.headersSent) {
      const headerNames = Object.keys(rawResponse.headers)
      for (let i = 0; i < headerNames.length; i += 1) {
        const headerName = headerNames[i]
        const headerValue = rawResponse.headers[headerName]
        toolkit.response.header(headerName, headerValue)
      }
    }
    if (rawResponse.cookies !== null && rawResponse.cookies !== undefined && !toolkit.response.headersSent) {
      const cookies = (rawResponse.cookies ?? []).map((cookie) => serializeSetCookieValue(cookie))
      if (cookies.length > 0) {
        // Possibly multiple headers, have to use array parameter to set them all as individual headers
        toolkit.response.header('set-cookie', cookies)
      }
    }
    if (rawResponse.body !== undefined && rawResponse.body !== null) {
      if (toolkit.response.writable) {
        toolkit.response.send(rawResponse.body)
      }
    } else {
      if (toolkit.response.writable) {
        toolkit.response.end()
      }
    }
  }

  public async handleError(toolkit: ExpressToolkit, error: any): Promise<void> {
    return toolkit.next(error)
  }
}
