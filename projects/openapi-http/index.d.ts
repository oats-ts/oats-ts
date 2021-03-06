import type { Validator } from '@oats-ts/validators'
import type { Try } from '@oats-ts/try'

export type ClientAdapter = {
  getPath<P>(input: P, serializer: (input: P) => Try<string>): Promise<string>
  getQuery<Q>(input: Q, serializer?: (input: Q) => Try<string | undefined>): Promise<string | undefined>
  getUrl(path: string, query?: string): Promise<string>
  getRequestHeaders<H>(
    input?: H,
    mimeType?: string,
    serializer?: (input: H) => Try<RawHttpHeaders>,
  ): Promise<RawHttpHeaders>
  getRequestBody<B>(mimeType?: string, input?: B): Promise<any>
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
  getPathParameters<P>(toolkit: T, deserializer: (input: string) => Try<P>): Promise<Try<P>>
  getQueryParameters<Q>(toolkit: T, deserializer: (input: string) => Try<Q>): Promise<Try<Q>>
  getRequestHeaders<H>(toolkit: T, deserializer: (input: RawHttpHeaders) => Try<H>): Promise<Try<H>>
  getMimeType<M extends string>(toolkit: T): Promise<M>
  getRequestBody<M extends string, B>(
    toolkit: T,
    required: boolean,
    mimeType: M | undefined,
    validator: RequestBodyValidators<M>,
  ): Promise<Try<B>>

  getStatusCode(toolkit: T, resp: HttpResponse): Promise<number>
  getResponseBody(toolkit: T, resp: HttpResponse): Promise<any>
  getResponseHeaders(toolkit: T, resp: HttpResponse, serializer?: ResponseHeadersSerializer): Promise<RawHttpHeaders>

  respond(toolkit: T, response: RawHttpResponse): Promise<void>
  handleError(toolkit: T, error: any): Promise<void>
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

export type ResponseBodyValidators = {
  [statusCode: number]: {
    [contentType: string]: Validator<any>
  }
  default?: {
    [contentType: string]: Validator<any>
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
