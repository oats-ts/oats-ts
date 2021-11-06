const Http = {
  name: '@oats-ts/openapi-http',
  ClientConfiguration: 'ClientConfiguration',
  HasHeaders: 'HasHeaders',
  HasPathParameters: 'HasPathParameters',
  HasQueryParameters: 'HasQueryParameters',
  HasRequestBody: 'HasRequestBody',
  HasIssues: 'HasIssues',
  HasNoIssues: 'HasNoIssues',
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
  serializers: 'serializers',
}

const ParameterDeserialization = {
  name: '@oats-ts/openapi-parameter-deserialization',
  createQueryDeserializer: 'createQueryDeserializer',
  createPathDeserializer: 'createPathDeserializer',
  createHeaderDeserializer: 'createHeaderDeserializer',
  deserializers: 'deserializers',
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
