import type { Validator } from '@oats-ts/validators'
import type { Try } from '@oats-ts/try'

export type ClientAdapter = {
  getPath<P>(input: P, descriptor: any): string
  getQuery<Q>(input: Q, descriptor: any): string | undefined
  getUrl(path: string, query?: string): string
  getCookieBasedRequestHeaders<C>(input?: C, descriptor?: any): RawHttpHeaders
  getParameterBasedRequestHeaders<H>(input: H, descriptor: any): RawHttpHeaders
  getMimeTypeBasedRequestHeaders(mimeType?: string): RawHttpHeaders
  getAuxiliaryRequestHeaders(): RawHttpHeaders
  getRequestBody<B>(mimeType?: string, input?: B): any
  request(request: RawHttpRequest): Promise<RawHttpResponse>
  getMimeType(response: RawHttpResponse): string | undefined
  getStatusCode(response: RawHttpResponse): number | undefined
  getResponseCookies(response: RawHttpResponse): SetCookieValue[]
  getResponseHeaders(response: RawHttpResponse, descriptors?: ResponseHeadersParameters): any
  getResponseBody(response: RawHttpResponse, validators?: ResponseBodyValidators): any
}

export type RunnableOperation<Request, Response> = {
  run(request: Request): Promise<Response>
}

export type ServerAdapter<T> = {
  getPathParameters<P>(toolkit: T, descriptor: any): Promise<Try<P>>
  getQueryParameters<Q>(toolkit: T, descriptor: any): Promise<Try<Q>>
  getCookieParameters<C>(toolkit: T, descriptor: any): Promise<Try<C>>
  getRequestHeaders<H>(toolkit: T, descriptor: any): Promise<Try<H>>
  getMimeType<M extends string>(toolkit: T): Promise<M>
  getRequestBody<M extends string, B>(
    toolkit: T,
    required: boolean,
    mimeType: M | undefined,
    validator: RequestBodyValidators<M>,
  ): Promise<Try<B>>

  getStatusCode(toolkit: T, resp: HttpResponse): Promise<number>
  getResponseBody(toolkit: T, resp: HttpResponse): Promise<any>
  getPreflightCorsHeaders(
    toolkit: T,
    method: HttpMethod | undefined,
    cors: OperationCorsConfiguration | undefined,
  ): Promise<RawHttpHeaders>
  getCorsHeaders(toolkit: T, cors: OperationCorsConfiguration | undefined): Promise<RawHttpHeaders>
  getAccessControlRequestedMethod(toolkit: T): HttpMethod | undefined
  getResponseHeaders(
    toolkit: T,
    resp: HttpResponse,
    serializer?: ResponseHeadersParameters,
    corsHeaders?: RawHttpHeaders,
  ): Promise<RawHttpHeaders>
  getResponseCookies(toolkit: T, resp: HttpResponse): Promise<SetCookieValue[]>

  respond(toolkit: T, response: RawHttpResponse): Promise<void>
  handleError(toolkit: T, error: any): Promise<void>
}

export type CorsConfiguration = {
  readonly [path: string]: {
    readonly [method in HttpMethod]?: OperationCorsConfiguration
  }
}

export type OperationCorsConfiguration = {
  readonly allowedOrigins?: string[] | boolean
  readonly allowedRequestHeaders?: string[]
  readonly allowedResponseHeaders?: string[]
  readonly allowCredentials?: boolean
  readonly maxAge?: number
}

export type RequestBodyValidators<C extends string = string> = {
  [contentType in C]: Validator<any>
}

export type ResponseHeadersParameters<S extends string = string> = {
  [statusCode in S]: any
}

export type ResponseHeadersSerializer<S extends string = string> = {
  [statusCode in S]: (input: any) => Try<RawHttpHeaders>
}

export type ResponseHeadersDeserializers<S extends string = string> = {
  [statusCode in S]: (input: RawHttpHeaders) => Try<any>
}

export type ResponseBodyValidators = {
  [statusCode: number]: {
    [contentType: string]: Validator<any>
  }
  default?: {
    [contentType: string]: Validator<any>
  }
}

/** Http methods which are possible to describe using OpenAPI spec. */
export type HttpMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'

/** Generic type representing a HTTP response */
export type HttpResponse<B = any, S = any, M = any, H = any> = {
  /** The parsed response body */
  body?: B
  /** The response status code */
  statusCode: S
  /** The mime type of the response */
  mimeType?: M
  /** The cookies in the response (Set-Cookie header) */
  cookies?: SetCookieValue[]
  /** The response headers */
  headers?: H
}

/**
 * Wraps a cookie value with all possible configuration.
 * Docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes
 */
export type SetCookieValue = CookieConfiguration & CookieValue

/**
 * Wraps a cookie value with all possible configuration.
 * Docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes
 */
export type TypedSetCookieValue<T> = CookieConfiguration & {
  /** The parsed value of the cookie */
  value: T
}

export type CookieValue = {
  /** The name of the cookie */
  name: string
  /** The raw value of the cookie */
  value: string
}

export type Cookies<T> = {
  [K in keyof T]: TypedSetCookieValue<T[K]>
}

export type CookieConfiguration = {
  /**
   * The expiration date of the cookie in UTC date format.
   * Use Date#toUTCString() or Date#toGMTString() to serialize a Date object to this format.
   */
  expires?: string
  /**
   * Maximum age (number of seconds) of the cookie.
   * If both maxAge and expires is present, maxAge has precedence.
   */
  maxAge?: number
  /**
   * Defines the host to which the cookie will be sent.
   */
  domain?: string
  /**
   * Indicates the path that must exist in the requested URL for the browser to send the Cookie header.
   */
  path?: string
  /**
   * Indicates that the cookie is sent to the server only when a request is made with the https scheme (except on localhost)
   */
  secure?: boolean
  /**
   * Forbids JavaScript from accessing the cookie
   */
  httpOnly?: boolean
  /**
   * Controls whether or not a cookie is sent with cross-site requests
   */
  sameSite?: 'Strict' | 'Lax' | 'None'
}

/** Http headers where key is the header name, value is the serialized header value. */
export type RawHttpHeaders = Record<string, string>

/** Object describing a Http request in a neutral format. */
export type RawHttpRequest = {
  /** Full url with path, and query. */
  url: string
  method: HttpMethod
  /** Request body, should only be set for the appropriate method. */
  body?: any
  /** Headers, content-type will be filled by default */
  headers?: RawHttpHeaders
}

/** Object describing a Http request in a neutral format. */
export type RawHttpResponse = {
  /** The response status code */
  statusCode?: number
  /** Request body, should only be set for the appropriate method. */
  body?: any
  /** Headers, content-type will be filled by default */
  headers?: RawHttpHeaders
  /** Cookies with optional parameters, and serialized name & value */
  cookies?: SetCookieValue[]
}
