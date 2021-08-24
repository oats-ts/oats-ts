/**
 * @param input The object (schema, operation, parameter, etc).
 * @param target The generator target (type definition, operation, etc).
 * @returns The desired path for the object based on target
 */
export type PathProvider = (input: any, target: string) => string

export type NameByTarget = Record<AsyncAPIGeneratorTarget, string>

export type AsyncAPIGeneratorTarget =
  | 'asyncapi/type'
  | 'asyncapi/type-guard'
  | 'asyncapi/query-type'
  | 'asyncapi/path-type'
  | 'asyncapi/channel'
  | 'asyncapi/subscribe-type'
  | 'asyncapi/publish-type'
  | 'asyncapi/query-serializer'
  | 'asyncapi/path-serializer'
  | 'asyncapi/api-type'
  | 'asyncapi/api-class'
  | 'asyncapi/api-stub'
  | 'asyncapi/validator'
