import { HttpMethod, HttpResponse, RawHttpHeaders } from '@oats-ts/openapi-http'
import { Issue } from '@oats-ts/validators'

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
  getPathParameters<Path>(request: Req, deserializer: (input: string) => Path): [Issue[], Path?]
  getQueryParameters<Query>(request: Req, deserializer: (input: string) => Query): [Issue[], Query?]
  getHeaderParameters<Headers>(request: Req, deserializer: (input: RawHttpHeaders) => Headers): [Issue[], Headers?]
}
