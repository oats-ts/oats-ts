import {
  RawHttpHeaders,
  HttpResponse,
  RawHttpResponse,
  RequestBodyValidators,
  ResponseHeadersSerializer,
  ServerAdapter,
} from '@oats-ts/openapi-http'
import { failure, fluent, success, Try } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'
import { ExpressToolkit } from './typings'

export class ExpressServerAdapter implements ServerAdapter<ExpressToolkit> {
  async getPathParameters<P>({ request }: ExpressToolkit, deserializer: (input: string) => Try<P>): Promise<Try<P>> {
    try {
      return deserializer(request.url)
    } catch (e) {
      const issue: Issue = {
        message: e.message,
        severity: 'error',
        path: '',
        type: '',
      }
      return failure([issue])
    }
  }
  async getQueryParameters<Q>(
    { request }: ExpressToolkit,
    deserializer: (input: string) => Try<Q>,
  ): Promise<Try<Q>> {
    try {
      return deserializer(new URL(request.url, 'http://test.com').search)
    } catch (e) {
      const issue: Issue = {
        message: e.message,
        severity: 'error',
        path: '',
        type: '',
      }
      return failure([issue])
    }
  }
  async getRequestHeaders<H>(
    { request }: ExpressToolkit,
    deserializer: (input: RawHttpHeaders) => Try<H>,
  ): Promise<Try<H>> {
    try {
      return deserializer(request.headers as RawHttpHeaders)
    } catch (e) {
      const issue: Issue = {
        message: e.message,
        severity: 'error',
        path: '',
        type: '',
      }
      return failure([issue])
    }
  }

  async getMimeType<M extends string>({ request }: ExpressToolkit): Promise<M> {
    return request.header('Content-Type') as M
  }

  async getRequestBody<M extends string, B>(
    { request }: ExpressToolkit,
    mimeType: M | undefined,
    validators: RequestBodyValidators<M>,
  ): Promise<Try<B>> {
    // No mimetype means that getMimeType failed
    if (mimeType === null || mimeType === undefined) {
      return success(undefined)
    }

    if (mimeType === null || mimeType === undefined) {
      const issue: Issue = {
        message: `Missing "Content-Type" header`,
        severity: 'error',
        path: '',
        type: '',
      }
      return failure([issue])
    }
    if (validators[mimeType] === null || validators[mimeType] === undefined) {
      const issue: Issue = {
        message: `Unexpected "Content-Type" request header "${mimeType}"`,
        severity: 'error',
        path: '',
        type: '',
      }
      return failure([issue])
    }
    const validator = validators[mimeType]
    const issues = validator(request.body)
    return issues.length > 0 ? failure(issues) : success(request.body as B)
  }

  async getStatusCode(input: ExpressToolkit, resp: HttpResponse): Promise<number> {
    return resp.statusCode
  }

  async getResponseBody(input: ExpressToolkit, resp: HttpResponse): Promise<any> {
    if (resp.body === null || resp.body === undefined) {
      return undefined
    }
    switch (resp.mimeType) {
      case 'application/json':
        return JSON.stringify(resp.body)
      case 'text/plain':
        return `${resp.body}`
      default:
        return resp.body
    }
  }

  async getResponseHeaders(
    input: ExpressToolkit,
    { mimeType, statusCode, headers }: HttpResponse,
    serializers?: ResponseHeadersSerializer,
  ): Promise<RawHttpHeaders> {
    const mimeTypeHeaders = mimeType === null || mimeType === undefined ? {} : { 'content-type': mimeType }
    if (serializers === null || serializers === undefined) {
      return mimeTypeHeaders
    }
    const serializer = serializers[statusCode]
    if (serializers === null || serializers === undefined) {
      return mimeTypeHeaders
    }
    return { ...fluent(serializer(headers)).getData(), ...mimeTypeHeaders }
  }

  async respond({ response, next }: ExpressToolkit, rawResponse: RawHttpResponse): Promise<void> {
    response.status(rawResponse.statusCode)
    if (rawResponse.headers !== null && rawResponse.headers !== undefined && !response.headersSent) {
      const headerNames = Object.keys(rawResponse.headers)
      for (let i = 0; i < headerNames.length; i += 1) {
        const headerName = headerNames[i]
        const headerValue = rawResponse.headers[headerName]
        response.setHeader(headerName, headerValue)
      }
    }
    if (response.writable) {
      response.send(rawResponse.body ?? '')
    }
    next()
  }

  async handleError({ next }: ExpressToolkit, error: Error): Promise<void> {
    return next(error)
  }
}