const Http = {
  name: '@oats-ts/openapi-http',
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
  CookieValue: 'CookieValue',
  Cookies: 'Cookies',
  ClientAdapter: 'ClientAdapter',
  ServerAdapter: 'ServerAdapter',
} as const

const HttpServerExpress = {
  name: '@oats-ts/openapi-express-server-adapter',
  ExpressToolkit: 'ExpressToolkit',
} as const

const ParameterSerialization = {
  name: '@oats-ts/openapi-parameter-serialization',
  createHeaderSerializer: 'createHeaderSerializer',
  createPathSerializer: 'createPathSerializer',
  createQuerySerializer: 'createQuerySerializer',
  createCookieSerializer: 'createCookieSerializer',
  createSetCookieSerializer: 'createSetCookieSerializer',
  serializers: 'serializers',
  createQueryDeserializer: 'createQueryDeserializer',
  createPathDeserializer: 'createPathDeserializer',
  createHeaderDeserializer: 'createHeaderDeserializer',
  createCookieDeserializer: 'createCookieDeserializer',
  createSetCookieDeserializer: 'createSetCookieDeserializer',
  deserializers: 'deserializers',
  dsl: 'dsl',
  HeaderDsl: 'HeaderDsl',
  CookieDsl: 'CookieDsl',
  PathDsl: 'PathDsl',
  QueryDsl: 'QueryDsl',
}

const Express = {
  name: 'express',
  Router: 'Router',
  Request: 'Request',
  Response: 'Response',
  NextFunction: 'NextFunction',
  RequestHandler: 'RequestHandler',
} as const

const Try = {
  name: '@oats-ts/try',
  Try: 'Try',
  getData: 'getData',
  map: 'map',
  flatMap: 'flatMap',
} as const

export const RuntimePackages = {
  Http,
  Express,
  HttpServerExpress,
  ParameterSerialization,
  Try,
} as const
