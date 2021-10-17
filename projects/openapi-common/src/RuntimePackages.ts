const Http = {
  name: '@oats-ts/openapi-http',
  ClientConfiguration: 'ClientConfiguration',
  HasHeaders: 'HasHeaders',
  HasPathParameters: 'HasPathParameters',
  HasQueryParameters: 'HasQueryParameters',
  HasRequestBody: 'HasRequestBody',
  HttpMethod: 'HttpMethod',
  HttpResponse: 'HttpResponse',
  RawHttpHeaders: 'RawHttpHeaders',
  RawHttpRequest: 'RawHttpRequest',
  RawHttpResponse: 'RawHttpResponse',
  ResponseExpectation: 'ResponseExpectation',
  ResponseExpectations: 'ResponseExpectations',
  StatusCode: 'StatusCode',
}

const HttpClient = {
  name: '@oats-ts/openapi-http-client',
  execute: 'execute',
}

const HttpServer = {
  name: '@oats-ts/openapi-http-server',
  ParameterIssues: 'ParameterIssues',
  ServerConfiguration: 'ServerConfiguration',
}

const HttpServerExpress = {
  name: '@oats-ts/openapi-http-server/lib/express',
  ExpressParameters: 'ExpressParameters',
}

const ParameterSerialization = {
  name: '@oats-ts/openapi-parameter-serialization',
  joinUrl: 'joinUrl',
  createHeaderSerializer: 'createHeaderSerializer',
  createPathSerializer: 'createPathSerializer',
  createQuerySerializer: 'createQuerySerializer',
}

const ParameterDeserialization = {
  name: '@oats-ts/openapi-parameter-deserialization',
  createQueryParser: 'createQueryParser',
  createPathParser: 'createPathParser',
  createHeaderParser: 'createHeaderParser',
  query: 'query',
  path: 'path',
  header: 'header',
  value: 'value',
}

const Express = {
  name: 'express',
  Router: 'Router',
  Request: 'Request',
  Response: 'Response',
  NextFunction: 'NextFunction',
}

export const RuntimePackages = {
  Http,
  HttpClient,
  HttpServer,
  Express,
  HttpServerExpress,
  ParameterSerialization,
  ParameterDeserialization,
}
