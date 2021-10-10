import { HttpMethod, RawHttpRequest, RawHttpResponse } from '@oats-ts/openapi-http'

export type PathConfiguration = {
  matches(method: HttpMethod, path: string): boolean
  handle(request: RawHttpRequest): Promise<RawHttpResponse>
}

export type ServerIssueType = 'path' | 'query' | 'request-headers' | 'response-headers' | 'handler' | 'unknown'

export type ServerIssue = {
  cause: any
  type: ServerIssueType
}
