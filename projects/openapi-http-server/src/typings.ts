import { HttpMethod, HttpResponse, RawHttpHeaders } from '@oats-ts/openapi-http'

export type PathConfiguration<P = any, Q = any, H = any, R = any> = {
  matches(method: HttpMethod, path: string): boolean
  handle(request: any): Promise<HttpResponse>
  deserializePath?(path: string): P
  deserializeQuery?(query: string): Q
  deserializeRequestHeaders?(headers: RawHttpHeaders): H
  serializeResponseHeaders?(headers: R): RawHttpHeaders
}

export type ServerIssueType = 'path' | 'query' | 'request-headers' | 'response-headers' | 'handler' | 'unknown'

export type ServerIssue = {
  cause: any
  type: ServerIssueType
}
