import type { Validator } from '@oats-ts/validators'
import { Try } from '@oats-ts/try'

export type ClientAdapter = {
  getPath(input: Partial<TypedHttpRequest>, serializer: (input: any) => Try<string>): Promise<string>
  getQuery(input: Partial<TypedHttpRequest>, serializer?: (input: any) => Try<string>): Promise<string | undefined>
  getUrl(path: string, query?: string): Promise<string>
  getRequestHeaders(
    input?: Partial<TypedHttpRequest>,
    serializer?: (input: any) => Try<RawHttpHeaders>,
  ): Promise<RawHttpHeaders>
  getRequestBody(input: Partial<TypedHttpRequest>): Promise<any>
  request(request: RawHttpRequest): Promise<RawHttpResponse>
  getMimeType(response: RawHttpResponse): Promise<string | undefined>
  getStatusCode(response: RawHttpResponse): Promise<number | undefined>
  getResponseHeaders(
    response: RawHttpResponse,
    statusCode?: number,
    deserializers?: ResponseHeadersDeserializers,
  ): Promise<any>
  getResponseBody(
    response: RawHttpResponse,
    statusCode?: number,
    mimeType?: string,
    validators?: ResponseBodyValidators,
  ): Promise<any>
}

export type ServerAdapter<T> = {
  getPathParameters<P>(frameworkInput: T, deserializer: (input: string) => Try<P>): Promise<Try<P>>
  getQueryParameters<Q>(frameworkInput: T, deserializer: (input: string) => Try<Q>): Promise<Try<Q>>
  getRequestHeaders<H>(frameworkInput: T, deserializer: (input: RawHttpHeaders) => Try<H>): Promise<Try<H>>
  getMimeType<M extends string>(frameworkInput: T): Promise<M>
  getRequestBody<M extends string, B>(
    frameworkInput: T,
    mimeType: M | undefined,
    validator: RequestBodyValidators<M>,
  ): Promise<Try<B>>

  getStatusCode(frameworkInput: T, resp: HttpResponse): Promise<number>
  getResponseBody(frameworkInput: T, resp: HttpResponse): Promise<any>
  getResponseHeaders(
    frameworkInput: T,
    resp: HttpResponse,
    serializer?: ResponseHeadersSerializer,
  ): Promise<RawHttpHeaders>

  respond(frameworkInput: T, response: RawHttpResponse): Promise<void>
  handleError(frameworkInput: T, error: Error): Promise<void>
}

export type RequestBodyValidators<C extends string = string> = {
  [contentType in C]: Validator<any>
}

export type ResponseHeadersSerializer<S extends string = string> = {
  [statusCode in S]: (input: any) => Try<RawHttpHeaders>
}

export type ResponseHeadersDeserializers<S extends string = string> = {
  [statusCode in S]: (input: RawHttpHeaders) => Try<any>
}

export type ResponseBodyValidators<V = unknown> = {
  [statusCode: number]: {
    [contentType: string]: V
  }
  default?: {
    [contentType: string]: V
  }
}

export type HasHeaders<T> = {
  headers: T
}

export type HasPathParameters<T> = {
  path: T
}

export type HasQueryParameters<T> = {
  query: T
}

export type HasRequestBody<M extends string, T> = {
  mimeType: M
  body: T
}

export type TypedHttpRequest<P = any, Q = any, H = any, M extends string = any, B = any> = HasHeaders<H> &
  HasPathParameters<P> &
  HasQueryParameters<Q> &
  HasRequestBody<M, B>

/** Http methods which are possible to describe using OpenAPI spec. */
export type HttpMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'

/** Generic type representing a HTTP response */
export type HttpResponse<B = any, S = any, M = any, H = any> = {
  /** The parsed response body */
  body: B
  /** The response status code */
  statusCode: S
  /** The mime type of the response */
  mimeType: M
  /** The response headers */
  headers?: H
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
  statusCode: number
  /** Request body, should only be set for the appropriate method. */
  body?: any
  /** Headers, content-type will be filled by default */
  headers?: RawHttpHeaders
}

/** Union of know status codes */
export type StatusCode =
  | 100
  | 101
  | 102
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 419
  | 420
  | 422
  | 423
  | 424
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 507
  | 511
