import {
  RawHttpHeaders,
  RawHttpRequest,
  RawHttpResponse,
  ResponseBodyValidators,
  ResponseHeadersDeserializers,
  TypedHttpRequest,
} from '@oats-ts/openapi-http'

export type ClientConfiguration = {
  getPath(input: Partial<TypedHttpRequest>, serializer: (input: any) => string): Promise<string>
  getQuery(input: Partial<TypedHttpRequest>, serializer?: (input: any) => string): Promise<string | undefined>
  getUrl(path: string, query?: string): Promise<string>
  getRequestHeaders(
    input: Partial<TypedHttpRequest>,
    serializer?: (input: any) => RawHttpHeaders,
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
