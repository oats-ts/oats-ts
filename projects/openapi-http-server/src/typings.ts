import { HttpMethod, HttpResponse, RawHttpHeaders } from '@oats-ts/openapi-http'
import { Issue, Validator } from '@oats-ts/validators'

export type PathConfiguration<P = any, Q = any, H = any, R = any> = {
  matches(method: HttpMethod, path: string): boolean
  handle(request: any): Promise<HttpResponse>
  deserializePath?(path: string): P
  deserializeQuery?(query: string): Q
  deserializeRequestHeaders?(headers: RawHttpHeaders): H
  serializeResponseHeaders?(headers: R): RawHttpHeaders
}

export type ParameterIssueType = 'path' | 'query' | 'request-headers'

export type ParameterIssues = {
  issues: Issue<ParameterIssueType>[]
}

export type ServerConfiguration<Req, Res> = {
  getPathParameters<Path>(request: Req, deserializer: (input: string) => Path): Promise<[Issue[], Path?]>
  getQueryParameters<Query>(request: Req, deserializer: (input: string) => Query): Promise<[Issue[], Query?]>
  getRequestHeaders<Headers>(
    request: Req,
    deserializer: (input: RawHttpHeaders) => Headers,
  ): Promise<[Issue[], Headers?]>
  getResponseHeaders<Headers>(headers: Headers, serializer: (input: Headers) => RawHttpHeaders): Promise<RawHttpHeaders>
  getRequestBody<Body, MimeType extends string>(
    request: Req,
    validator: Validator<any>,
  ): Promise<[Issue[], Body?, MimeType?]>
  getResponseBody<Body, MimeType extends string>(body: Body, mimeType: MimeType): Promise<any>
  setStatusCode<Code extends number>(response: Res, code: Code): Promise<void>
  setResponseBody<Body, MimeType extends string>(response: Res, mimeType: MimeType, body: Body): Promise<void>
  setResponseHeaders(response: Res, headers: RawHttpHeaders): Promise<void>
}
