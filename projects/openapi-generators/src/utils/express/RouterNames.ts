export const RouterNames = {
  request: 'request',
  response: 'response',
  next: 'next',
  locals: 'locals',
  router: 'router',

  api: 'api',
  adapter: 'adapter',
  toolkit: 'toolkit',
  issues: 'issues',
  mimeType: 'mimeType',
  body: 'body',
  query: 'query',
  path: 'path',
  cookies: 'cookies',
  headers: 'headers',
  error: 'error',
  method: 'method',
  corsConfig: 'corsConfig',
  corsHeaders: 'corsHeaders',

  header: 'header',
  origin: 'origin',
  setHeader: 'setHeader',

  typedRequest: 'typedRequest',
  typedResponse: 'typedResponse',
  rawResponse: 'rawResponse',

  statusCode: 'statusCode',
  responseHeaders: 'responseHeaders',
  responseBody: 'responseBody',

  respond: 'respond',
  getAccessControlRequestedMethod: 'getAccessControlRequestedMethod',
  getPreflightCorsHeaders: 'getPreflightCorsHeaders',
  getCorsHeaders: 'getCorsHeaders',
  getResponseHeaders: 'getResponseHeaders',
  handleError: 'handleError',

  allowedOrigins: 'allowedOrigins',
  allowedRequestHeaders: 'allowedRequestHeaders',
  allowedResponseHeaders: 'allowedResponseHeaders',
  allowCredentials: 'allowCredentials',
  maxAge: 'maxAge',

  apiKey: (hash: number) => {
    return `__oats_api_${hash.toString(36)}`
  },
  adapterKey: (hash: number) => {
    return `__oats_adapter_${hash.toString(36)}`
  },
}
