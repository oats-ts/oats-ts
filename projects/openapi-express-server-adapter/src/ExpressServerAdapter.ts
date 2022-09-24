import {
  RawHttpHeaders,
  HttpResponse,
  RawHttpResponse,
  RequestBodyValidators,
  ResponseHeadersSerializer,
  ServerAdapter,
  Cookies,
  HttpMethod,
} from '@oats-ts/openapi-http'
import { failure, isFailure, success, Try } from '@oats-ts/try'
import { configure, ConfiguredValidator, DefaultConfig, stringify, Validator } from '@oats-ts/validators'
import { serializeCookieValue } from '@oats-ts/openapi-parameter-serialization'
import { ExpressToolkit } from './typings'
import MIMEType from 'whatwg-mimetype'

export class ExpressServerAdapter implements ServerAdapter<ExpressToolkit> {
  protected configureRequestBodyValidator(validator: Validator<any>): ConfiguredValidator<any> {
    return configure(validator, 'requestBody', DefaultConfig)
  }
  async getPathParameters<P>(toolkit: ExpressToolkit, deserializer: (input: string) => Try<P>): Promise<Try<P>> {
    return deserializer(toolkit.request.url)
  }
  async getQueryParameters<Q>(toolkit: ExpressToolkit, deserializer: (input: string) => Try<Q>): Promise<Try<Q>> {
    return deserializer(new URL(toolkit.request.url, 'http://test.com').search)
  }
  async getCookieParameters<C>(
    toolkit: ExpressToolkit,
    deserializer: (input?: string) => Try<Partial<C>>,
  ): Promise<Try<Partial<C>>> {
    return deserializer(toolkit.request.header('cookie'))
  }
  async getRequestHeaders<H>(
    toolkit: ExpressToolkit,
    deserializer: (input: RawHttpHeaders) => Try<H>,
  ): Promise<Try<H>> {
    return deserializer(toolkit.request.headers as RawHttpHeaders)
  }

  async getMimeType<M extends string>(toolkit: ExpressToolkit): Promise<M> {
    const mimeType = toolkit.request.header('Content-Type')
    if (mimeType === null || mimeType === undefined) {
      return undefined as unknown as M
    }
    return new MIMEType(mimeType).essence as M
  }

  async getRequestBody<M extends string, B>(
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
    const issues = validator(toolkit.request.body)
    return issues.length > 0 ? failure(...issues) : success(toolkit.request.body as B)
  }

  async getStatusCode(input: ExpressToolkit, response: HttpResponse): Promise<number> {
    return response.statusCode
  }

  async getResponseBody(input: ExpressToolkit, response: HttpResponse): Promise<any> {
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

  async getPreflightCorsHeaders(
    { request }: ExpressToolkit,
    allowedOrigins: true | string[],
    allowedMethods: HttpMethod[],
    allowedRequestHeaders: Partial<Record<HttpMethod, string[]>>,
    allowedResponseHeaders: Partial<Record<HttpMethod, string[]>>,
  ): Promise<RawHttpHeaders> {
    const corsHeaders: RawHttpHeaders = {}

    /**
     * Grab origin header, we need to check if it's among allowed origins
     * (or if we don't care about origin, meaning allowedOrigins is true)
     */
    const origin = request.header('Origin')
    /**
     * Grab the header describing what request method the client tried to use,
     * and in case the header is present, transform it to lowercase.
     */
    const requestedMethod = request.header('Access-Control-Request-Method')?.toLowerCase() as HttpMethod | undefined
    /**
     * Grab the header, describing what request header the client wants to send,
     * and in case present, split it, and transform them to lowercase.
     */
    const requestedHeaders = (request.header('Access-Control-Request-Headers') ?? '')
      .split(',')
      .map((header) => header.trim().toLowerCase())

    /** In case the origin the client requested is allowed (or we don't care)*/
    if (allowedOrigins === true || (typeof origin === 'string' && allowedOrigins.includes(origin))) {
      corsHeaders['Access-Control-Allow-Origin'] = origin ?? '*'
      /** In case the client provided which method they want, and it's allowed */
      if (requestedMethod !== null && requestedMethod !== undefined && allowedMethods.includes(requestedMethod)) {
        corsHeaders['Access-Control-Allow-Methods'] = requestedMethod.toUpperCase()

        /** If the client specified request headers they want to send */
        if (Array.isArray(requestedHeaders) && requestedHeaders.length > 0) {
          /** We grab the allowed request headers for the given method */
          const allowedRequestHeadersForMethod = allowedRequestHeaders[requestedMethod] ?? []
          /** Filter out the ones we actually allow (don't expose ones we would allow, but the client doesn't specify) */
          const allowedReqHeaders = requestedHeaders.filter((header) => allowedRequestHeadersForMethod.includes(header))
          /** If there are allowed headers, we set the header */
          if (allowedReqHeaders.length > 0) {
            corsHeaders['Access-Control-Allow-Headers'] = allowedReqHeaders.join(', ')
          }
        }

        /** We grab the allowed response headers based on the request method */
        const allowedResponseHeadersForMethod = allowedResponseHeaders[requestedMethod] ?? []
        /** If there are any, we set the appropriate header */
        if (allowedResponseHeadersForMethod.length > 0) {
          corsHeaders['Access-Control-Expose-Headers'] = allowedResponseHeadersForMethod.join(', ')
        }
      }
    }

    return corsHeaders
  }

  async getCorsHeaders(
    { request }: ExpressToolkit,
    allowedOrigins: true | string[],
    allowedResponseHeaders: string[],
  ): Promise<RawHttpHeaders> {
    const corsHeaders: RawHttpHeaders = {}
    /**
     * Grab origin header, we need to check if it's among allowed origins
     * (or if we don't care about origin, meaning allowedOrigins is true)
     */
    const origin = request.header('Origin')
    /** In case the origin the client requested is allowed (or we don't care)*/
    if (allowedOrigins === true || allowedOrigins.includes(origin!)) {
      corsHeaders['Access-Control-Allow-Origin'] = origin ?? '*'

      if (allowedResponseHeaders.length > 0) {
        corsHeaders['Access-Control-Expose-Headers'] = allowedResponseHeaders.join(', ')
      }
    }
    return corsHeaders
  }

  async getResponseHeaders(
    input: ExpressToolkit,
    response: HttpResponse,
    serializers?: ResponseHeadersSerializer,
    corsHeaders?: RawHttpHeaders,
  ): Promise<RawHttpHeaders> {
    const baseHeaders: RawHttpHeaders = {
      ...(corsHeaders ?? {}),
      ...(response.mimeType === null || response.mimeType === undefined ? {} : { 'content-type': response.mimeType }),
    }

    if (serializers === null || serializers === undefined) {
      return baseHeaders
    }
    const serializer = serializers[response.statusCode]
    if (serializer === null || serializer === undefined) {
      return baseHeaders
    }
    const headers = serializer(response.headers)
    if (isFailure(headers)) {
      throw new Error(`Failed to serialize response headers:\n${headers.issues.map(stringify).join('\n')}`)
    }
    return {
      ...headers.data,
      ...baseHeaders,
    }
  }

  async getResponseCookies<C>(
    _: ExpressToolkit,
    resp: HttpResponse<any, any, any, any, C>,
    serializer?: (input: Cookies<C>) => Try<Cookies<Record<string, string>>>,
  ): Promise<Cookies<Record<string, string>>> {
    if (resp.cookies === null || resp.cookies === undefined || serializer === null || serializer === undefined) {
      return {}
    }
    const cookies = serializer(resp.cookies)
    if (isFailure(cookies)) {
      throw new Error(`Failed to serialize response cookies:\n${cookies.issues.map(stringify).join('\n')}`)
    }
    return cookies.data
  }

  async respond(toolkit: ExpressToolkit, rawResponse: RawHttpResponse): Promise<void> {
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
      const cookies = Object.keys(rawResponse.cookies).map((cookieName) =>
        serializeCookieValue(cookieName, rawResponse.cookies![cookieName]),
      )
      if (cookies.length > 0) {
        // Possibly multiple headers, have to use array parameter to set them all as individual headers
        toolkit.response.header('set-cookie', cookies)
      }
    }
    if (toolkit.response.writable) {
      toolkit.response.send(rawResponse.body ?? '')
    }
  }

  async handleError(toolkit: ExpressToolkit, error: any): Promise<void> {
    return toolkit.next(error)
  }
}
