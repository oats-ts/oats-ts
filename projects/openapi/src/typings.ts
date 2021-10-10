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
  | 'openapi/validator'
  | 'openapi/query-type'
  | 'openapi/path-type'
  | 'openapi/headers-type'
  | 'openapi/response-type'
  | 'openapi/request-type'
  | 'openapi/response-headers-type'
  | 'openapi/headers-serializer'
  | 'openapi/query-serializer'
  | 'openapi/path-serializer'
  | 'openapi/headers-deserializer'
  | 'openapi/query-deserializer'
  | 'openapi/path-deserializer'
  | 'openapi/sdk-type'
  | 'openapi/client-sdk'
  | 'openapi/sdk-stub'
  // Client
  | 'openapi/expectations'
  | 'openapi/operation'
  // Server
  | 'openapi/request-handler-type'
  | 'openapi/request-matcher'
  | 'openapi/request-listener'
