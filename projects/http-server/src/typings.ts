/** Http methods which are possible to describe using OpenAPI spec. */
export type HttpMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'

/** Http headers where key is the header name, value is the serialized header value. */
export type HttpHeaders = Record<string, string>

/** Object describing a Http request in a neutral format. */
export type HttpRequest = {
  /** Full url with path, and query. */
  url: string
  method: HttpMethod
  /** Request body, should only be set for the appropriate method. */
  body?: any
  /** Headers, content-type will be filled by default */
  headers?: HttpHeaders
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

/** Generic type representing a HTTP response */
export type HttpResponse<Body = any, Status = any, MimeType extends string = any> = {
  /** The full request url */
  url: string
  /** The response body */
  body: Body
  /** The response status code */
  statusCode: Status
  /** The response headers (might become strictly typed in the future) */
  headers: HttpHeaders
  /** The mime type of the response */
  mimeType: MimeType
}

export type ResponseExpectation<V = unknown> = {
  [contentType: string]: V
}

export type ResponseExpectations<V = unknown> = {
  [statusCode: number]: ResponseExpectation<V>
  default?: ResponseExpectation<V>
}

/** Configuration for performing a HTTP request */
export type RequestConfig<R = unknown, V = unknown> = {
  /** The common base of the url */
  baseUrl: string
  /** Performs the HTTP request and returns a Promise with a value that the rest of the methods will receive */
  request(request: HttpRequest): Promise<R>
  /** Serializes the request body */
  serialize(contentType: string, body: any): Promise<any>
  /** Retrieves the status code from the response */
  statusCode(response: R): Promise<number>
  /** Retrieves the mime type from the response (usually using the content-type header) */
  mimeType(response: R): Promise<string>
  /** Retrieves and parses the request body from the response */
  body(response: R, mimeType: string): Promise<unknown>
  /** Retrieves the response headers from the response */
  headers(response: R): Promise<HttpHeaders>
  /** Validates the response body */
  validate(body: unknown, validator: V): void
}

type OmmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] }
