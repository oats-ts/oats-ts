import { GeneratorContext } from '@oats-ts/oats-ts'
import { entries } from 'lodash'
import { RuntimePackage, RuntimePackageInternal } from './typings'

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

const rulesExports = {
  SchemaRule: 'SchemaRule',
  HeaderDescriptorRule: 'HeaderDescriptorRule',
  PathDescriptorRule: 'PathDescriptorRule',
  CookieDescriptorRule: 'CookieDescriptorRule',
  QueryDescriptorRule: 'QueryDescriptorRule',
  schemas: 'schemas',
  parameters: 'parameters',
}

const rulesContent = {
  schemas: {
    string: 'string',
    intersection: 'intersection',
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

export type TryExports = typeof tryExports
export type TryPackage = RuntimePackage<TryExports, {}>

export type OpenApiHttpExports = typeof openApiHttpExports
export type OpenApiHttpPackage = RuntimePackage<OpenApiHttpExports, {}>

export type OpenApiParameterSerializationExports = typeof openApiParameterSerializationExports
export type OpenApiParameterSerializationPackage = RuntimePackage<OpenApiParameterSerializationExports, {}>

export type OpenApiExpressServerAdapterExports = typeof openApiExpressServerAdapterExports
export type OpenApiExpressServerAdapterPackage = RuntimePackage<OpenApiExpressServerAdapterExports, {}>

export type RulesExports = typeof rulesExports
export type RulesContent = typeof rulesContent

export type ExpressExports = typeof expressExports
export type ExpressPackage = RuntimePackage<ExpressExports, {}>

export type RulesPackage = RuntimePackage<RulesExports, RulesContent>

export type OpenAPIRuntimeExports = TryExports &
  OpenApiHttpExports &
  OpenApiParameterSerializationExports &
  RulesExports
export type OpenAPIRuntimeContent = RulesContent
export type OpenAPIRuntimePackage = RuntimePackage<OpenAPIRuntimeExports, OpenAPIRuntimeContent>

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
    ...tryExports,
    ...openApiHttpExports,
    ...openApiParameterSerializationExports,
    ...rulesExports,
  },
  content: {
    ...rulesContent,
  },
}

const openApiFetchClientAdapter = {
  name: '@oats-ts/openapi-fetch-client-adapter',
  content: {},
  exports: {},
}

const rules = {
  name: '@oats-ts/rules',
  content: rulesContent,
  exports: rulesExports,
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
  rules: createPackage<RulesPackage>(rules),
  try: createPackage<TryPackage>(_try),
  openApiHttp: createPackage<OpenApiHttpPackage>(openApiHttp),
  openApiExpressServerAdapter: createPackage<OpenApiExpressServerAdapterPackage>(openApiExpressServerAdapter),
  openApiParameterSerialization: createPackage<OpenApiParameterSerializationPackage>(openApiParameterSerialization),
  express: createPackage<ExpressPackage>(express),
  openApiRuntime: createPackage<OpenAPIRuntimePackage>(openApiRuntime),
  openApiFetchClientAdapter: createPackage(openApiFetchClientAdapter),
}
