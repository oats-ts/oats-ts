import {
  RawHttpHeaders,
  HttpResponse,
  RawHttpResponse,
  RequestBodyValidators,
  ResponseHeadersSerializer,
} from '@oats-ts/openapi-http'
import { Issue } from '@oats-ts/validators'
import { ServerConfiguration, Try } from '../typings'
import { ExpressParameters } from './typings'

export class ExpressServerConfiguration implements ServerConfiguration<ExpressParameters> {
  async getPathParameters<P>({ request }: ExpressParameters, deserializer: (input: string) => P): Promise<Try<P>> {
    try {
      return [[], deserializer(request.url)]
    } catch (e) {
      const issue: Issue = {
        message: e.message,
        severity: 'error',
        path: '',
        type: '',
      }
      return [[issue], undefined]
    }
  }
  async getQueryParameters<Q>({ request }: ExpressParameters, deserializer: (input: string) => Q): Promise<Try<Q>> {
    try {
      return [[], deserializer(new URL(request.url, 'http://test.com').search)]
    } catch (e) {
      const issue: Issue = {
        message: e.message,
        severity: 'error',
        path: '',
        type: '',
      }
      return [[issue], undefined]
    }
  }
  async getRequestHeaders<H>(
    { request }: ExpressParameters,
    deserializer: (input: RawHttpHeaders) => H,
  ): Promise<Try<H>> {
    try {
      return [[], deserializer(request.headers as RawHttpHeaders)]
    } catch (e) {
      const issue: Issue = {
        message: e.message,
        severity: 'error',
        path: '',
        type: '',
      }
      return [[issue], undefined]
    }
  }
  async getMimeType<M extends string>(
    { request }: ExpressParameters,
    validator: RequestBodyValidators<M>,
  ): Promise<Try<M>> {
    const contentType = request.header('Content-Type') as M
    if (contentType === null || contentType === undefined) {
      const issue: Issue = {
        message: `Missing "Content-Type" header`,
        severity: 'error',
        path: '',
        type: '',
      }
      return [[issue], undefined]
    }
    if (validator[contentType] === null || validator[contentType] === undefined) {
      const issue: Issue = {
        message: `Unexpected "Content-Type" request header "${contentType}"`,
        severity: 'error',
        path: '',
        type: '',
      }
      return [[issue], undefined]
    }
    return [[], contentType]
  }

  async getRequestBody<M extends string, B>(
    { request }: ExpressParameters,
    mimeType: M | undefined,
    validators: RequestBodyValidators<M>,
  ): Promise<Try<B>> {
    // No mimetype means that getMimeType failed
    if (mimeType === null || mimeType === undefined) {
      return [[], undefined]
    }
    const validator = validators[mimeType]
    const issues = validator(request.body)
    return issues.length > 0 ? [issues, undefined] : [[], request.body as B]
  }

  async getStatusCode(input: ExpressParameters, resp: HttpResponse): Promise<number> {
    return resp.statusCode
  }

  async getResponseBody(input: ExpressParameters, resp: HttpResponse): Promise<any> {
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
    input: ExpressParameters,
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
    return { ...serializer(headers), ...mimeTypeHeaders }
  }

  async respond({ response, next }: ExpressParameters, rawResponse: RawHttpResponse): Promise<void> {
    response.status(rawResponse.statusCode)
    if (rawResponse.headers !== null && rawResponse.headers !== undefined && !response.headersSent) {
      const headerNames = Object.keys(rawResponse.headers)
      for (let i = 0; i < headerNames.length; i += 1) {
        const headerName = headerNames[i]
        const headerValue = rawResponse.headers[headerName]
        response.header(headerName, headerValue)
      }
    }
    if (rawResponse.body !== null && rawResponse.body !== undefined && response.writable) {
      response.send(rawResponse.body)
    }
    next()
  }
}
