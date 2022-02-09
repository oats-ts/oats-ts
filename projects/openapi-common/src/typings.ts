import { HeadersObject, OpenAPIObject, OperationObject, ParameterObject } from '@oats-ts/openapi-model'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { CodeGenerator, GeneratorNameProvider, NameProvider } from '@oats-ts/generator'
import { HttpMethod } from '@oats-ts/openapi-http'
import { GeneratorContext } from '@oats-ts/model-common'
import { JsonSchemaGeneratorTarget } from '@oats-ts/json-schema-common'

/**
 * @param input The object (schema, operation, parameter, etc).
 * @param target The generator target (type definition, operation, etc).
 * @returns The desired path for the object based on target
 */
export type PathProvider = (input: any, target: string) => string

export type NameByTarget = Record<OpenAPIGeneratorTarget, string>

export type PathDelegate = (basePath: string, input: any, name: NameProvider, target: string) => string

export type DelegatingPathProviderInput = Record<OpenAPIGeneratorTarget, PathDelegate>
export type DelegatingNameProviderInput = Record<OpenAPIGeneratorTarget, GeneratorNameProvider>

export type OpenAPIGeneratorTarget =
  // Common
  | JsonSchemaGeneratorTarget
  | 'openapi/request-body-validator'
  | 'openapi/response-body-validator'
  | 'openapi/query-type'
  | 'openapi/path-type'
  | 'openapi/request-headers-type'
  | 'openapi/response-type'
  | 'openapi/request-type'
  | 'openapi/request-server-type'
  | 'openapi/response-headers-type'
  | 'openapi/request-headers-serializer'
  | 'openapi/response-headers-serializer'
  | 'openapi/query-serializer'
  | 'openapi/path-serializer'
  | 'openapi/request-headers-deserializer'
  | 'openapi/response-headers-deserializer'
  | 'openapi/query-deserializer'
  | 'openapi/path-deserializer'
  // Client
  | 'openapi/operation'
  | 'openapi/sdk-type'
  | 'openapi/sdk-impl'
  | 'openapi/sdk-stub'
  // Server
  | 'openapi/api-type'
  | 'openapi/express-route'
  | 'openapi/express-routes-type'
  | 'openapi/express-route-factory'
  | 'openapi/express-cors-middleware'

export type OpenAPIGenerator<P extends OpenAPIGeneratorTarget = OpenAPIGeneratorTarget> = CodeGenerator<
  OpenAPIReadOutput,
  TypeScriptModule,
  P,
  OpenAPIGeneratorTarget
>
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
