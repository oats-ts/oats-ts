import {
  RawHttpHeaders,
  HttpResponse,
  RawHttpResponse,
  RequestBodyValidators,
  ResponseHeadersSerializer,
  ServerAdapter,
} from '@oats-ts/openapi-http'
import { failure, isFailure, success, Try } from '@oats-ts/try'
import { configure, ConfiguredValidator, DefaultConfig, stringify, Validator } from '@oats-ts/validators'
import { ExpressToolkit } from './typings'
import MIMEType from 'whatwg-mimetype'

export class ExpressServerAdapter implements ServerAdapter<ExpressToolkit> {
  protected configureRequestBodyValidator(validator: Validator<any>): ConfiguredValidator<any> {
    return configure(validator, 'requestBody', DefaultConfig)
  }
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
    const mimeType = toolkit.request.header('Content-Type')
    if (mimeType === null || mimeType === undefined) {
      return undefined as unknown as M
    }
    return new MIMEType(mimeType).essence as M
  }

  async getRequestBody<M extends string, B>(
    toolkit: ExpressToolkit,
    required: boolean,
    mimeType: M | undefined,
    validators: RequestBodyValidators<M>,
  ): Promise<Try<B>> {
    // No mimetype means we can only pass if the request body is not required.
    if (mimeType === null || mimeType === undefined) {
      if (!required) {
        return success(undefined as unknown as B)
      }
      return failure({
        message: `missing "content-type" header`,
        severity: 'error',
        path: 'headers',
      })
    }
    if (validators[mimeType] === null || validators[mimeType] === undefined) {
      const contentTypes = Object.keys(validators)
      const expectedContentTypes =
        contentTypes.length === 1 ? `"${contentTypes[0]}"` : `one of ${contentTypes.map((ct) => `"${ct}"`).join(', ')}`
      return failure({
        message: `"content-type" should be ${expectedContentTypes}`,
        severity: 'error',
        path: 'headers',
      })
    }
    const validator = this.configureRequestBodyValidator(validators[mimeType])
    const issues = validator(toolkit.request.body)
    return issues.length > 0 ? failure(...issues) : success(toolkit.request.body as B)
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
    const mimeTypeHeaders: RawHttpHeaders =
      response.mimeType === null || response.mimeType === undefined ? {} : { 'content-type': response.mimeType }
    if (serializers === null || serializers === undefined) {
      return mimeTypeHeaders
    }
    const serializer = serializers[response.statusCode]
    if (serializer === null || serializer === undefined) {
      return mimeTypeHeaders
    }
    const headers = serializer(response.headers)
    if (isFailure(headers)) {
      throw new Error(`Failed to serialize response headers:\n${headers.issues.map(stringify).join('\n')}`)
    }
    return {
      ...headers.data,
      ...mimeTypeHeaders,
    }
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

  async handleError(toolkit: ExpressToolkit, error: any): Promise<void> {
    return toolkit.next(error)
  }
}
