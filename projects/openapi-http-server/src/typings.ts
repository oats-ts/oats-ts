import {
  HttpResponse,
  RawHttpHeaders,
  RawHttpResponse,
  RequestBodyValidators,
  ResponseHeadersSerializer,
} from '@oats-ts/openapi-http'
import { Try } from '@oats-ts/try'

export type ServerConfiguration<T> = {
  getPathParameters<P>(frameworkInput: T, deserializer: (input: string) => Try<P>): Promise<Try<P>>
  getQueryParameters<Q>(frameworkInput: T, deserializer: (input: string) => Try<Q>): Promise<Try<Q>>
  getRequestHeaders<H>(frameworkInput: T, deserializer: (input: RawHttpHeaders) => Try<H>): Promise<Try<H>>
  getMimeType<M extends string>(frameworkInput: T): Promise<M>
  getRequestBody<M extends string, B>(
    frameworkInput: T,
    mimeType: M | undefined,
    validator: RequestBodyValidators<M>,
  ): Promise<Try<B>>

  getStatusCode(frameworkInput: T, resp: HttpResponse): Promise<number>
  getResponseBody(frameworkInput: T, resp: HttpResponse): Promise<any>
  getResponseHeaders(
    frameworkInput: T,
    resp: HttpResponse,
    serializer?: ResponseHeadersSerializer,
  ): Promise<RawHttpHeaders>

  respond(frameworkInput: T, response: RawHttpResponse): Promise<void>
  handleError(frameworkInput: T, error: Error): Promise<void>
}
