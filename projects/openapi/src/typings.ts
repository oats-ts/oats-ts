/**
 * @param input The object (schema, operation, parameter, etc).
 * @param target The generator target (type definition, operation, etc).
 * @returns The desired path for the object based on target
 */
export type PathProvider = (input: any, target: string) => string

export type NameByTarget = Record<OpenAPIGeneratorTarget, string>

export type OpenAPIGeneratorTarget =
  // Common
  | 'openapi/type'
  | 'openapi/type-guard'
  | 'openapi/type-validator'
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
  | 'openapi/client-sdk'
  | 'openapi/sdk-stub'
  // Server
  | 'openapi/api-type'
  | 'openapi/api-stub'
  | 'openapi/express-route'
