/**
 * @param input The object (schema, operation, parameter, etc).
 * @param target The generator target (type definition, operation, etc).
 * @returns The desired path for the object based on target
 */
export type PathProvider = (input: any, target: string) => string

export type NameByTarget = Record<OpenAPIGeneratorTarget, string>

export type OpenAPIGeneratorTarget =
  | 'openapi/type'
  | 'openapi/type-guard'
  | 'openapi/operation'
  | 'openapi/query-type'
  | 'openapi/path-type'
  | 'openapi/headers-type'
  | 'openapi/response-type'
  | 'openapi/input-type'
  | 'openapi/headers-serializer'
  | 'openapi/query-serializer'
  | 'openapi/path-serializer'
  | 'openapi/expectations'
  | 'openapi/api-type'
  | 'openapi/api-class'
  | 'openapi/api-stub'
  | 'openapi/validator'
