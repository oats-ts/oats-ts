import MIMEType from 'whatwg-mimetype'
import {
  TypedHttpRequest,
  RawHttpHeaders,
  RawHttpRequest,
  RawHttpResponse,
  ResponseHeadersDeserializers,
  ResponseBodyValidators,
} from '@oats-ts/openapi-http'
import { ClientConfiguration } from '../typings'
import { success, Try } from '@oats-ts/try'

export abstract class AbstractClientConfiguration implements ClientConfiguration {
  private readonly baseUrl?: string
  abstract request(request: RawHttpRequest): Promise<RawHttpResponse>

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl
  }

  async getPath(input: Partial<TypedHttpRequest>, serializer: (input: any) => string): Promise<string> {
    return serializer(input.path)
  }
  async getQuery(input: Partial<TypedHttpRequest>, serializer: (input: any) => string): Promise<string | undefined> {
    // There are no query parameters, no query string returned by this
    if (serializer === undefined || serializer === null) {
      return undefined
    }
    return serializer(input.query)
  }
  async getUrl(path: string, query?: string): Promise<string> {
    return [typeof this.baseUrl !== 'string' ? '' : this.baseUrl, path, typeof query !== 'string' ? '' : query].join('')
  }
  async getRequestHeaders(
    input?: Partial<TypedHttpRequest>,
    serializer?: (input: any) => RawHttpHeaders,
  ): Promise<RawHttpHeaders> {
    return {
      ...(serializer === undefined || serializer === null || input === undefined || input === null
        ? {}
        : serializer(input.headers)),
      ...(typeof input?.mimeType === 'string' ? { 'content-type': input.mimeType } : {}),
    }
  }
  async getRequestBody(input: Partial<TypedHttpRequest>): Promise<any> {
    if (typeof input.mimeType !== 'string') {
      return undefined
    }
    switch (input.mimeType) {
      case 'application/json':
        return JSON.stringify(input.body)
      default:
        return input.body
    }
  }
  async getStatusCode(response: RawHttpResponse): Promise<number | undefined> {
    return response.statusCode
  }
  async getMimeType(response: RawHttpResponse): Promise<string | undefined> {
    const mimeType = response.headers?.['content-type']
    return typeof mimeType === 'string' ? new MIMEType(mimeType).essence : undefined
  }
  async getResponseHeaders(
    response: RawHttpResponse,
    statusCode?: number,
    deserializers?: ResponseHeadersDeserializers,
  ): Promise<Try<any>> {
    if (deserializers === null || deserializers === undefined) {
      return success(undefined)
    }
    if (typeof statusCode !== 'number' || typeof deserializers[statusCode] !== 'function') {
      const statusCodes = Object.keys(deserializers)
      const mimeTypesHint =
        statusCodes.length === 1
          ? `Expected "${statusCodes[0]}".`
          : `Expected one of ${statusCodes.map((type) => `"${type}"`).join(',')}`
      throw new Error(`Unexpected status code : ${statusCode}. ${mimeTypesHint}`)
    }
    if (response.headers === null || response.headers === undefined) {
      throw new Error(`Response headers should not be ${response.headers}`)
    }
    return deserializers[statusCode](response.headers)
  }
  async getResponseBody(
    response: RawHttpResponse,
    statusCode?: number,
    mimeType?: string,
    validators?: ResponseBodyValidators<unknown>,
  ): Promise<any> {
    // If expectations not provided, return undefined, nothing to validate.
    if (validators === null || validators === undefined) {
      return undefined
    }

    if (typeof statusCode !== 'number') {
      throw new Error(`Status code should not be ${statusCode}`)
    }

    const validatorsForStatus = validators[statusCode] || validators.default

    // In case the status code returned by the server was not found among the expectations, throw.
    if (validatorsForStatus === undefined || validatorsForStatus === null) {
      const statusCodes = Object.keys(validators)
      const statusCodesHint =
        statusCodes.length === 1
          ? `Expected "${statusCodes[0]}".`
          : `Expected one of ${statusCodes.map((code) => `"${code}"`).join(',')}`
      throw new Error(`Unexpected status code: "${statusCode}". ${statusCodesHint}`)
    }

    // In case the mime type returned by the server was not found amount expectations, throw.
    if (typeof mimeType !== 'string' || typeof validatorsForStatus[mimeType] !== 'function') {
      const mimeTypes = Object.keys(validatorsForStatus)
      const mimeTypesHint =
        mimeTypes.length === 1
          ? `Expected "${mimeTypes[0]}".`
          : `Expected one of ${mimeTypes.map((type) => `"${type}"`).join(',')}`
      throw new Error(`Unexpected mime type: "${mimeType}". ${mimeTypesHint}`)
    }

    // TODO validate!
    // const validator = validatorsForStatus[mimeType]
    return response.body
  }
}
