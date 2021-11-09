import {
  RawHttpHeaders,
  RawHttpRequest,
  RawHttpResponse,
  ResponseBodyValidators,
  ResponseHeadersDeserializers,
  TypedHttpRequest,
} from '@oats-ts/openapi-http'

export type ClientConfiguration = {
  getPath(input: Partial<TypedHttpRequest>, serializer?: (input: any) => string): Promise<string>
  getQuery(input: Partial<TypedHttpRequest>, serializer: (input: any) => string): Promise<string>
  getUrl(path: string, query?: string): Promise<string>
  getRequestHeaders(
    input: Partial<TypedHttpRequest>,
    serializer?: (input: any) => RawHttpHeaders,
  ): Promise<RawHttpHeaders>
  getRequestBody(input: Partial<TypedHttpRequest>): Promise<any>
  request(request: RawHttpRequest): Promise<RawHttpResponse>
  getResponseHeaders(response: RawHttpResponse, deserializers?: ResponseHeadersDeserializers): Promise<any>
  getResponseBody(response: RawHttpResponse, validators?: ResponseBodyValidators): Promise<any>
  getStatusCode(response: RawHttpResponse): Promise<number>
  getMimeType(response: RawHttpResponse): Promise<string>
}
