import { HeadersObject, OpenAPIObject, OperationObject, ParameterObject } from '@oats-ts/openapi-model'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { NameProvider, PathProviderHelper } from '@oats-ts/oats-ts'
import { HttpMethod } from '@oats-ts/openapi-http'
import { GeneratorContext } from '@oats-ts/model-common'

/**
 * @param input The object (schema, operation, parameter, etc).
 * @param target The generator target (type definition, operation, etc).
 * @returns The desired path for the object based on target
 */
export type PathProvider = (input: any, target: string) => string

export type NameByTarget = Record<OpenAPIGeneratorTarget, string>

export type PathDelegate = (basePath: string, input: any, target: string, helper: PathProviderHelper) => string

export type DelegatingPathProviderInput = Record<OpenAPIGeneratorTarget, PathDelegate>
export type DelegatingNameProviderInput = Record<OpenAPIGeneratorTarget, NameProvider>

export type OpenAPIGeneratorTarget =
  // Common
  | 'oats/type'
  | 'oats/type-guard'
  | 'oats/type-validator'
  | 'oats/request-body-validator'
  | 'oats/response-body-validator'
  | 'oats/query-type'
  | 'oats/path-type'
  | 'oats/request-headers-type'
  | 'oats/response-type'
  | 'oats/request-type'
  | 'oats/request-server-type'
  | 'oats/response-headers-type'
  | 'oats/request-headers-serializer'
  | 'oats/response-headers-serializer'
  | 'oats/query-serializer'
  | 'oats/path-serializer'
  | 'oats/request-headers-deserializer'
  | 'oats/response-headers-deserializer'
  | 'oats/query-deserializer'
  | 'oats/path-deserializer'
  // Client
  | 'oats/operation'
  | 'oats/sdk-type'
  | 'oats/sdk-impl'
  // Server
  | 'oats/api-type'
  | 'oats/express-router'
  | 'oats/express-routers-type'
  | 'oats/express-router-factory'
  | 'oats/express-cors-middleware'

export type OpenAPIGeneratorContext = GeneratorContext<OpenAPIObject, OpenAPIGeneratorTarget>

/**
 * Type to contain all the related stuff for an operation.
 * It exists to prevent passing around a large amount of parameters.
 */
export type EnhancedOperation = {
  url: string
  method: HttpMethod
  operation: OperationObject
  query: ParameterObject[]
  path: ParameterObject[]
  cookie: ParameterObject[]
  header: ParameterObject[]
}

export type EnhancedResponse = {
  schema: SchemaObject | ReferenceObject
  statusCode: string
  mediaType: string
  headers: HeadersObject
}

export type ParameterKind = 'primitive' | 'object' | 'array' | 'unknown'
