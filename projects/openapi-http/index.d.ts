import type { Issue } from '@oats-ts/validators'

/** Configuration for performing a HTTP request */
export type ClientConfiguration<R = any, V = any> = {
  /** The common base of the url */
  baseUrl: string
  /** Performs the HTTP request and returns a Promise with a value that the rest of the methods will receive */
  request(request: RawHttpRequest): Promise<R>
  /** Serializes the request body */
  serialize(contentType: string, body: any): Promise<any>
  /** Retrieves the status code from the response */
  statusCode(response: R): Promise<number>
  /** Retrieves the mime type from the response (usually using the content-type header) */
  mimeType(response: R): Promise<string>
  /** Retrieves and parses the request body from the response */
  body(response: R, mimeType: string): Promise<unknown>
  /** Retrieves the response headers from the response */
  headers(response: R): Promise<RawHttpHeaders>
  /** Validates the response body */
  validate(body: unknown, validator: V): void
}
/** Configuration for handling a HTTP request server side */
export type ServerConfiguration<Req = any, Res = any> = {
  getPath(request: RawHttpRequest): Promise<string>
  getQuery(request: RawHttpRequest): Promise<string>
  getRequestHeaders(request: RawHttpRequest): Promise<RawHttpHeaders>
  getRequest(req: Req): Promise<RawHttpRequest>
  respond(res: Res, raw: RawHttpResponse): Promise<void>
  deserializeRequestBody(contentType: string, body: any): Promise<any>
  serializeResponseBody(contentType: string, body: any): Promise<any>
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

export type HasIssues = {
  issues: Issue[]
}

export type HasNoIssues = {
  issues?: undefined
}

export type HasRequestBody<C extends string, T> = {
  mimeType: C
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
  headers: H
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

export type ResponseExpectation<V> = {
  [contentType: string]: V
}

export type ResponseExpectations<V = unknown> = {
  [statusCode: number]: ResponseExpectation<V>
  default?: ResponseExpectation<V>
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
