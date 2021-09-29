/** Generic type representing a HTTP response */
export type HttpResponse<B, S, M, H> = {
  /** The full request url */
  url: string
  /** The parsed response body */
  body: B
  /** The response status code */
  statusCode: S
  /** The mime type of the response */
  mimeType: M
  /** The response headers */
  headers: H
}
