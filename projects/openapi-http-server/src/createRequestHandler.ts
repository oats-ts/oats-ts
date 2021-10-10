import {
  RawHttpRequest,
  RawHttpResponse,
  ServerConfiguration,
  HttpResponse,
  ServerParameterConfiguration,
} from '@oats-ts/openapi-http'
import { TypedRequest } from './internalTypings'

export const createRequestHandler =
  (config: ServerConfiguration) =>
  (paramConfig: ServerParameterConfiguration, handler: (request: any) => Promise<HttpResponse>) =>
  async (request: RawHttpRequest): Promise<RawHttpResponse> => {
    const { deserializePath, deserializeQuery, deserializeRequestHeaders, serializeResponseHeaders } = paramConfig

    // Build all the parameters for the typed handler
    const requestMimeType = request.headers?.contentType
    const path =
      deserializePath === null || deserializePath === undefined
        ? undefined
        : deserializePath(await config.getPath(request))
    const query =
      deserializeQuery === null || deserializeQuery === undefined
        ? undefined
        : deserializeQuery(await config.getQuery(request))
    const requestHeaders =
      deserializeRequestHeaders === null || deserializeRequestHeaders === undefined
        ? undefined
        : deserializeRequestHeaders(await config.getRequestHeaders(request))
    const requestBody =
      request.body === null || request.body === undefined
        ? undefined
        : await config.deserializeRequestBody(requestMimeType, request.body)

    const typedRequest: TypedRequest = {
      path,
      query,
      body: requestBody,
      headers: requestHeaders,
      mimeType: requestMimeType,
    }

    // Let the handler run
    const typedResponse = await handler(typedRequest)

    // Convert it to raw, serialized format & return
    const responseBody =
      typedResponse.body === null || typedResponse.body === undefined
        ? undefined
        : await config.serializeResponseBody(typedResponse.mimeType, typedResponse.body)

    const responseHeaders =
      serializeResponseHeaders === null || serializeResponseHeaders === undefined
        ? undefined
        : serializeResponseHeaders(typedResponse.headers)

    const response: RawHttpResponse = {
      body: responseBody,
      headers: responseHeaders,
      statusCode: typedResponse.statusCode,
    }

    return response
  }
