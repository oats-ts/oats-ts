import {
  HttpResponse,
  RawHttpHeaders,
  RawHttpResponse,
  RequestBodyValidators,
  ResponseHeadersSerializer,
} from '@oats-ts/openapi-http'
import { Issue } from '@oats-ts/validators'

export type Try<T> = [[], T] | [Issue[], undefined]

export type ServerConfiguration<T> = {
  getPathParameters<P>(frameworkInput: T, deserializer: (input: string) => P): Promise<Try<P>>
  getQueryParameters<Q>(frameworkInput: T, deserializer: (input: string) => Q): Promise<Try<Q>>
  getRequestHeaders<H>(frameworkInput: T, deserializer: (input: RawHttpHeaders) => H): Promise<Try<H>>
  getMimeType<M extends string>(frameworkInput: T, validator: RequestBodyValidators<M>): Promise<Try<M>>
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
}
