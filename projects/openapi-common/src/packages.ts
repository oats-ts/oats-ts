import { GeneratorContext } from '@oats-ts/oats-ts'
import { entries } from 'lodash'
import { RuntimePackage, RuntimePackageInternal } from './typings'

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
  TypedSetCookieValue: 'TypedSetCookieValue',
  SetCookieValue: 'SetCookieValue',
  CookieValue: 'CookieValue',
  Cookies: 'Cookies',
  ClientAdapter: 'ClientAdapter',
  RunnableOperation: 'RunnableOperation',
  ServerAdapter: 'ServerAdapter',
  CorsConfiguration: 'CorsConfiguration',
  StatusCode1XX: 'StatusCode1XX',
  StatusCode2XX: 'StatusCode2XX',
  StatusCode3XX: 'StatusCode3XX',
  StatusCode4XX: 'StatusCode4XX',
  StatusCode5XX: 'StatusCode5XX',
}

const openApiExpressServerAdapterExports = {
  ExpressToolkit: 'ExpressToolkit',
}

const openApiParameterSerializationExports = {
  parameter: 'parameter',
  dsl: 'dsl',
  HeaderDsl: 'HeaderDsl',
  CookieDsl: 'CookieDsl',
  PathDsl: 'PathDsl',
  QueryDsl: 'QueryDsl',
  QueryParameters: 'QueryParameters',
  PathParameters: 'PathParameters',
  HeaderParameters: 'HeaderParameters',
  CookieParameters: 'CookieParameters',
  parsePathToMatcher: 'parsePathToMatcher',
  parsePathToSegments: 'parsePathToSegments',
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
export type OpenApiParameterSerializationPackage = RuntimePackage<OpenApiParameterSerializationExports, {}>

export type OpenApiExpressServerAdapterExports = typeof openApiExpressServerAdapterExports
export type OpenApiExpressServerAdapterPackage = RuntimePackage<OpenApiExpressServerAdapterExports, {}>

export type ExpressExports = typeof expressExports
export type ExpressPackage = RuntimePackage<ExpressExports, {}>

export type OpenAPIRuntimeExports = ValidatorsExports &
  TryExports &
  OpenApiHttpExports &
  OpenApiParameterSerializationExports
export type OpenAPIRuntimeContent = ValidatorsContent
export type OpenAPIRuntimePackage = RuntimePackage<OpenAPIRuntimeExports, OpenAPIRuntimeContent>

const validators = {
  name: '@oats-ts/validators',
  exports: validatorsExports,
  content: validatorsContent,
}

const _try = {
  name: '@oats-ts/try',
  exports: tryExports,
  content: {},
}

const openApiHttp = {
  name: '@oats-ts/openapi-http',
  exports: openApiHttpExports,
  content: {},
}

const openApiExpressServerAdapter = {
  name: '@oats-ts/openapi-express-server-adapter',
  exports: openApiExpressServerAdapterExports,
  content: {},
}

const openApiParameterSerialization = {
  name: '@oats-ts/openapi-parameter-serialization',
  exports: openApiParameterSerializationExports,
  content: {},
}

const express = {
  name: 'express',
  exports: expressExports,
  content: {},
}

const openApiRuntime = {
  name: '@oats-ts/openapi-runtime',
  exports: {
    ...validatorsExports,
    ...tryExports,
    ...openApiHttpExports,
    ...openApiParameterSerializationExports,
  },
  content: {
    ...validatorsContent,
  },
}

const openApiFetchClientAdapter = {
  name: '@oats-ts/openapi-fetch-client-adapter',
  content: {},
  exports: {},
}

const createPackage =
  <T extends RuntimePackage<any, any>>(pkg: RuntimePackageInternal<any, any>) =>
  (context: GeneratorContext): T => {
    const { name, content, exports } = pkg
    return {
      name,
      content,
      imports: entries(exports).reduce((newExports: Record<string, string | [string, string]>, [key, originalName]) => {
        const exportedName = context.exportOf(name, originalName as string)
        const value =
          exportedName === originalName ? originalName : ([originalName, exportedName] as string | [string, string])
        return {
          ...newExports,
          [key]: value,
        }
      }, {}),
      exports: entries(exports).reduce((newExports: Record<string, string>, [key, originalName]) => {
        const exportedName = context.exportOf(name, originalName as string)
        return {
          ...newExports,
          [key]: exportedName === originalName ? originalName : exportedName,
        }
      }, {}),
    } as T
  }

export const packages = {
  validators: createPackage<ValidatorsPackage>(validators),
  try: createPackage<TryPackage>(_try),
  openApiHttp: createPackage<OpenApiHttpPackage>(openApiHttp),
  openApiExpressServerAdapter: createPackage<OpenApiExpressServerAdapterPackage>(openApiExpressServerAdapter),
  openApiParameterSerialization: createPackage<OpenApiParameterSerializationPackage>(openApiParameterSerialization),
  express: createPackage<ExpressPackage>(express),
  openApiRuntime: createPackage<OpenAPIRuntimePackage>(openApiRuntime),
  openApiFetchClientAdapter: createPackage(openApiFetchClientAdapter),
}
