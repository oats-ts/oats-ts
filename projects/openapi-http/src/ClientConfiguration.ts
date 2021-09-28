import { RawHttpHeaders } from './RawHttpHeaders'
import { RawHttpRequest } from './RawHttpRequest'

/** Configuration for performing a HTTP request */
export type ClientConfiguration<R, V> = {
  /** The common base of the url */
  baseUrl: string
  /** Performs the HTTP request and returns a Promise with a value that the rest of the methods will receive */
  request(request: RawHttpRequest): Promise<R>
  /** Serializes the request body */
  serialize(contentType: string, body: any): Promise<any>
  /** Retrieves the status code from the response */
  statusCode(response: R): Promise<number>
  /** Retrieves the mime type from the response (usually using the content-type header) */
  mimeType(response: R): Promise<string>
  /** Retrieves and parses the request body from the response */
  body(response: R, mimeType: string): Promise<unknown>
  /** Retrieves the response headers from the response */
  headers(response: R): Promise<RawHttpHeaders>
  /** Validates the response body */
  validate(body: unknown, validator: V): void
}
