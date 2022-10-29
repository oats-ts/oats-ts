import { RuntimePackage } from './types'

const validatorsExports = {
  validators: 'validators',
}

const validatorsContent = {
  validators: {
    string: 'string',
    combine: 'combine',
    enumeration: 'enumeration',
    number: 'number',
    boolean: 'boolean',
    array: 'array',
    object: 'object',
    optional: 'optional',
    shape: 'shape',
    items: 'items',
    record: 'record',
    any: 'any',
    union: 'union',
    lazy: 'lazy',
    literal: 'literal',
    tuple: 'tuple',
  },
}

const tryExports = {
  Try: 'Try',
  getData: 'getData',
  map: 'map',
  flatMap: 'flatMap',
}

const openApiHttpExports = {
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
  CorsConfiguration: 'CorsConfiguration',
}

const openApiExpressServerAdapterExports = {
  ExpressToolkit: 'ExpressToolkit',
}

const openApiParameterSerializationExports = {
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

const openApiParameterSerializationContent = {
  serializers: {
    createHeaderSerializer: 'createHeaderSerializer',
    createPathSerializer: 'createPathSerializer',
    createQuerySerializer: 'createQuerySerializer',
    createCookieSerializer: 'createCookieSerializer',
    createSetCookieSerializer: 'createSetCookieSerializer',
  },
  deserializers: {
    createQueryDeserializer: 'createQueryDeserializer',
    createPathDeserializer: 'createPathDeserializer',
    createHeaderDeserializer: 'createHeaderDeserializer',
    createCookieDeserializer: 'createCookieDeserializer',
    createSetCookieDeserializer: 'createSetCookieDeserializer',
  },
  dsl: {
    value: {
      optional: 'optional',
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      literal: 'literal',
      enum: 'enum',
    },
    path: {
      simple: { primitive: 'primitive', array: 'array', object: 'object' },
      label: { primitive: 'primitive', array: 'array', object: 'object' },
      matrix: { primitive: 'primitive', array: 'array', object: 'object' },
    },
    query: {
      form: { primitive: 'primitive', array: 'array', object: 'object' },
      spaceDelimited: { array: 'array' },
      pipeDelimited: { array: 'array' },
      deepObject: { object: 'object' },
    },
    header: {
      simple: { primitive: 'primitive', array: 'array', object: 'object' },
    },
    cookie: {
      form: { primitive: 'primitive' },
    },
  },
}

const expressExports = {
  Router: 'Router',
  IRouter: 'IRouter',
  Request: 'Request',
  Response: 'Response',
  NextFunction: 'NextFunction',
  RequestHandler: 'RequestHandler',
  Handler: 'Handler',
}

export type ValidatorsExports = typeof validatorsExports
export type ValidatorsContent = typeof validatorsContent
export type ValidatorsPackage = RuntimePackage<ValidatorsExports, ValidatorsContent>

export type TryExports = typeof tryExports
export type TryPackage = RuntimePackage<TryExports, {}>

export type OpenApiHttpExports = typeof openApiHttpExports
export type OpenApiHttpPackage = RuntimePackage<OpenApiHttpExports, {}>

export type OpenApiParameterSerializationExports = typeof openApiParameterSerializationExports
export type OpenApiParameterSerializationContent = typeof openApiParameterSerializationContent
export type OpenApiParameterSerializationPackage = RuntimePackage<
  OpenApiParameterSerializationExports,
  OpenApiParameterSerializationContent
>

export type OpenApiExpressServerAdapterExports = typeof openApiExpressServerAdapterExports
export type OpenApiExpressServerAdapterPackage = RuntimePackage<OpenApiExpressServerAdapterExports, {}>

export type ExpressExports = typeof expressExports
export type ExpressPackage = RuntimePackage<ExpressExports, {}>

export type OpenAPIRuntimeExports = ValidatorsExports &
  TryExports &
  OpenApiHttpExports &
  OpenApiParameterSerializationExports
export type OpenAPIRuntimeContent = ValidatorsContent & OpenApiParameterSerializationContent
export type OpenAPIRuntimePackage = RuntimePackage<OpenAPIRuntimeExports, OpenAPIRuntimeContent>

export const validators: ValidatorsPackage = {
  name: '@oats-ts/validators',
  exports: validatorsExports,
  content: validatorsContent,
}

export const _try: TryPackage = {
  name: '@oats-ts/try',
  exports: tryExports,
  content: {},
}

export const openApiHttp: OpenApiHttpPackage = {
  name: '@oats-ts/openapi-http',
  exports: openApiHttpExports,
  content: {},
}

export const openApiExpressServerAdapter: OpenApiExpressServerAdapterPackage = {
  name: '@oats-ts/openapi-express-server-adapter',
  exports: openApiExpressServerAdapterExports,
  content: {},
}

export const openApiParameterSerialization: OpenApiParameterSerializationPackage = {
  name: '@oats-ts/openapi-parameter-serialization',
  exports: openApiParameterSerializationExports,
  content: openApiParameterSerializationContent,
}

export const express: ExpressPackage = {
  name: 'express',
  exports: expressExports,
  content: {},
}

export const openApiRuntime: OpenAPIRuntimePackage = {
  name: '@oats-ts/openapi-runtime',
  exports: {
    ...validatorsExports,
    ...tryExports,
    ...openApiHttpExports,
    ...openApiParameterSerializationExports,
  },
  content: {
    ...validatorsContent,
    ...openApiParameterSerializationContent,
  },
}

export const openApiFetchClientAdapter: RuntimePackage<{}, {}> = {
  name: '@oats-ts/openapi-fetch-client-adapter',
  content: {},
  exports: {},
}

export const packages = {
  validators,
  try: _try,
  openApiHttp,
  openApiExpressServerAdapter,
  openApiParameterSerialization,
  express,
  openApiRuntime,
  openApiFetchClientAdapter,
}
