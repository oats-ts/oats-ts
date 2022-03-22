import {
  RawHttpHeaders,
  HttpResponse,
  RawHttpResponse,
  RequestBodyValidators,
  ResponseHeadersSerializer,
  ServerAdapter,
} from '@oats-ts/openapi-http'
import { failure, fluent, success, Try } from '@oats-ts/try'
import { configure, Issue, IssueTypes } from '@oats-ts/validators'
import { ExpressToolkit } from './typings'

export class ExpressServerAdapter implements ServerAdapter<ExpressToolkit> {
  async getPathParameters<P>(toolkit: ExpressToolkit, deserializer: (input: string) => Try<P>): Promise<Try<P>> {
    return deserializer(toolkit.request.url)
  }
  async getQueryParameters<Q>(toolkit: ExpressToolkit, deserializer: (input: string) => Try<Q>): Promise<Try<Q>> {
    return deserializer(new URL(toolkit.request.url, 'http://test.com').search)
  }
  async getRequestHeaders<H>(
    toolkit: ExpressToolkit,
    deserializer: (input: RawHttpHeaders) => Try<H>,
  ): Promise<Try<H>> {
    return deserializer(toolkit.request.headers as RawHttpHeaders)
  }

  async getMimeType<M extends string>(toolkit: ExpressToolkit): Promise<M> {
    return toolkit.request.header('Content-Type') as M
  }

  async getRequestBody<M extends string, B>(
    toolkit: ExpressToolkit,
    mimeType: M | undefined,
    validators: RequestBodyValidators<M>,
  ): Promise<Try<B>> {
    // No mimetype means that getMimeType failed
    if (mimeType === null || mimeType === undefined) {
      const issue: Issue = {
        message: `missing "content-type" header`,
        severity: 'error',
        path: 'headers',
        type: IssueTypes.other,
      }
      return failure([issue])
    }
    if (validators[mimeType] === null || validators[mimeType] === undefined) {
      const issue: Issue = {
        message: `unexpected "content-type" request header "${mimeType}"`,
        severity: 'error',
        path: 'headers',
        type: IssueTypes.other,
      }
      return failure([issue])
    }
    const validator = configure(validators[mimeType], 'requestBody')
    const issues = validator(toolkit.request.body)
    return issues.length > 0 ? failure(issues) : success(toolkit.request.body as B)
  }

  async getStatusCode(input: ExpressToolkit, response: HttpResponse): Promise<number> {
    return response.statusCode
  }

  async getResponseBody(input: ExpressToolkit, response: HttpResponse): Promise<any> {
    if (response.body === null || response.body === undefined) {
      return undefined
    }
    switch (response.mimeType) {
      case 'application/json':
        return JSON.stringify(response.body)
      case 'text/plain':
        return `${response.body}`
      default:
        return response.body
    }
  }

  async getResponseHeaders(
    input: ExpressToolkit,
    response: HttpResponse,
    serializers?: ResponseHeadersSerializer,
  ): Promise<RawHttpHeaders> {
    const mimeTypeHeaders =
      response.mimeType === null || response.mimeType === undefined ? {} : { 'content-type': response.mimeType }
    if (serializers === null || serializers === undefined) {
      return mimeTypeHeaders
    }
    const serializer = serializers[response.statusCode]
    if (serializer === null || serializer === undefined) {
      return mimeTypeHeaders
    }
    return { ...fluent(serializer(response.headers)).getData(), ...mimeTypeHeaders }
  }

  async respond(toolkit: ExpressToolkit, rawResponse: RawHttpResponse): Promise<void> {
    toolkit.response.status(rawResponse.statusCode)
    if (rawResponse.headers !== null && rawResponse.headers !== undefined && !toolkit.response.headersSent) {
      const headerNames = Object.keys(rawResponse.headers)
      for (let i = 0; i < headerNames.length; i += 1) {
        const headerName = headerNames[i]
        const headerValue = rawResponse.headers[headerName]
        toolkit.response.setHeader(headerName, headerValue)
      }
    }
    if (toolkit.response.writable) {
      toolkit.response.send(rawResponse.body ?? '')
    }
    toolkit.next()
  }

  async handleError(toolkit: ExpressToolkit, error: Error): Promise<void> {
    return toolkit.next(error)
  }
}
