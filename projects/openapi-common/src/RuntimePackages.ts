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

const ParameterSerialization = {
  name: '@oats-ts/openapi-parameter-serialization',
  joinUrl: 'joinUrl',
  createHeaderSerializer: 'createHeaderSerializer',
  createPathSerializer: 'createPathSerializer',
  createQuerySerializer: 'createQuerySerializer',
}

export const RuntimePackages = {
  Http,
  HttpClient,
  ParameterSerialization,
}
