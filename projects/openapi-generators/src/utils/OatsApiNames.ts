import {
  ClientAdapter,
  ServerAdapter,
  RawHttpResponse,
  RawHttpRequest,
  OperationCorsConfiguration,
  RunnableOperation,
  HttpResponse,
} from '@oats-ts/openapi-http'

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
  headers: 'headers',
}

export const RawHttpResponseFields: Record<keyof RawHttpResponse, keyof RawHttpResponse> = {
  headers: 'headers',
  statusCode: 'statusCode',
  body: 'body',
  cookies: 'cookies',
}

export const HttpResponseFields: Record<keyof HttpResponse, keyof HttpResponse> = {
  headers: 'headers',
  statusCode: 'statusCode',
  body: 'body',
  cookies: 'cookies',
  mimeType: 'mimeType',
}

export const TypedRequestFields = {
  path: 'path',
  query: 'query',
  requestHeaders: 'headers',
  cookies: 'cookies',
  mimeType: 'mimeType',
  body: 'body',
} as const

export const ExpressFields = {
  locals: 'locals',
  use: 'use',
}

export const ExpressToolkitFields = {
  request: 'request',
  response: 'response',
  next: 'next',
}

export const OperationCorsConfigurationFields: Record<
  keyof OperationCorsConfiguration,
  keyof OperationCorsConfiguration
> = {
  allowedOrigins: 'allowedOrigins',
  allowedRequestHeaders: 'allowedRequestHeaders',
  allowedResponseHeaders: 'allowedResponseHeaders',
  allowCredentials: 'allowCredentials',
  maxAge: 'maxAge',
}

export const RunnableOperationMethods: Record<keyof RunnableOperation<any, any>, keyof RunnableOperation<any, any>> = {
  run: 'run',
}
