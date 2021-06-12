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
  headers: HttpHeaders
}

/**  */
export type HttpResponse = {
  url: string
  body: any
  statusCode: number
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

export type HttpAdapter = (request: HttpRequest) => Promise<any>

export type ResponseParser = (response: any, hint: ResponseParserHint) => Promise<HttpResponse>

export type RequestConfig = {
  baseUrl: string
  request: HttpAdapter
  parse: ResponseParser
}
