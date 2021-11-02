import {
  HasHeaders,
  HasPathParameters,
  HasQueryParameters,
  RawHttpHeaders,
  RawHttpRequest,
} from '@oats-ts/openapi-http'

/** TODO */
export type ClientConfiguration<R = any, V = any> = {
  getPath<T>(input: HasPathParameters<T>, serializer: (input: T) => string): Promise<string>
  getQuery<T>(input: HasQueryParameters<T>, serializer: (input: T) => string): Promise<string>
  getUrl(path: string, query: string): Promise<string>
  getRequestHeaders<T>(input: HasHeaders<T>, serializer: (input: T) => RawHttpHeaders): Promise<string>
  getRequestBody(contentType: string, body: any): Promise<any>
  request(request: RawHttpRequest): Promise<R>
  getStatusCode(response: R): Promise<number>
  getMimeType(response: R): Promise<string>
  getResponseBody(response: R, mimeType: string): Promise<unknown>
  getResponseHeaders<H>(response: R, deserializers: any): Promise<RawHttpHeaders>
  validateResponseBody(body: unknown, mimeType: string, validator: V): void
}
