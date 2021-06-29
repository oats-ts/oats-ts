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

export type HttpResponse<Body = any, Status = any> = {
  url: string
  body: Body
  statusCode: Status
  headers: HttpHeaders
}

export type ContentValidator = (input: any) => void

export type ResponseValidator = {
  [contentType: string]: ContentValidator | undefined
}

export type ResponseParserHint = {
  [statusCode: number]: ResponseValidator
  default?: ResponseValidator
}

export type BodySerializer = (contentType: string, body: any) => Promise<any>

export type RequestFn = (request: HttpRequest) => Promise<any>

export type ResponseParser = (response: any, hint: ResponseParserHint) => Promise<HttpResponse>

export type RequestConfig = {
  baseUrl: string
  serialize: BodySerializer
  request: RequestFn
  parse: ResponseParser
}
