import { ClientAdapter, ServerAdapter, RawHttpResponse, RawHttpRequest } from '@oats-ts/openapi-http'

export const ServerAdapterMethods: Record<keyof ServerAdapter<any>, keyof ServerAdapter<any>> = {
  getPathParameters: 'getPathParameters',
  getQueryParameters: 'getQueryParameters',
  getCookieParameters: 'getCookieParameters',
  getRequestHeaders: 'getRequestHeaders',
  getMimeType: 'getMimeType',
  getRequestBody: 'getRequestBody',
  getStatusCode: 'getStatusCode',
  getResponseBody: 'getResponseBody',
  getPreflightCorsHeaders: 'getPreflightCorsHeaders',
  getCorsHeaders: 'getCorsHeaders',
  getAccessControlRequestedMethod: 'getAccessControlRequestedMethod',
  getResponseHeaders: 'getResponseHeaders',
  getResponseCookies: 'getResponseCookies',
  respond: 'respond',
  handleError: 'handleError',
}

export const ClientAdapterMethods: Record<keyof ClientAdapter, keyof ClientAdapter> = {
  getPath: 'getPath',
  getQuery: 'getQuery',
  getUrl: 'getUrl',
  getCookies: 'getCookies',
  getRequestHeaders: 'getRequestHeaders',
  getRequestBody: 'getRequestBody',
  request: 'request',
  getMimeType: 'getMimeType',
  getStatusCode: 'getStatusCode',
  getResponseCookies: 'getResponseCookies',
  getResponseHeaders: 'getResponseHeaders',
  getResponseBody: 'getResponseBody',
}

export const RawHttpRequestFields: Record<keyof RawHttpRequest, keyof RawHttpRequest> = {
  url: 'url',
  method: 'method',
  body: 'body',
  headers: 'body',
}

export const RawHttpResponseFields: Record<keyof RawHttpResponse, keyof RawHttpResponse> = {
  headers: 'headers',
  statusCode: 'statusCode',
  body: 'body',
  cookies: 'cookies',
}

export const TypedRequestFields = {
  path: 'path',
  query: 'query',
  requestHeaders: 'headers',
  cookies: 'cookies',
  mimeType: 'mimeType',
  body: 'body',
} as const
