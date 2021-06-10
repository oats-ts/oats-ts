/** Http methods which are possible to describe using OpenAPI spec. */
export type HttpMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'

/** Http headers where key is the header name, value is the serialized header value. */
export type HttpHeaders = Record<string, string>

/** Common blob type found both on the browser and node */
export type BlobType = {
  readonly size: number
  readonly type: string
  arrayBuffer(): Promise<any>
  slice(start?: number, end?: number, type?: string): BlobType
  text(): Promise<string>
}

export type RequestBody = any

/** Object describing a Http request in a neutral format. */
export type HttpRequest = {
  /** Full url with path, and query. */
  url: string
  method: HttpMethod
  /** Request body, should only be set for the appropriate method. */
  body?: RequestBody
  /** Headers, content-type will be filled by default */
  headers: HttpHeaders
}

export type ResponseBody = BlobType

export type HttpResponse = {
  statusCode: number
  body: ResponseBody
  headers: HttpHeaders
}

export type HttpAdapter = (request: HttpRequest) => Promise<HttpResponse>
