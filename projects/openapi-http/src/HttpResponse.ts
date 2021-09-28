/** Generic type representing a HTTP response */
export type HttpResponse<Body, Headers, Status, MimeType> = {
  /** The full request url */
  url: string
  /** The parsed response body */
  body: Body
  /** The response status code */
  statusCode: Status
  /** The parsed response headers */
  headers: Headers
  /** The mime type of the response */
  mimeType: MimeType
}
