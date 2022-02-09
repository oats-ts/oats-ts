import { JsonSchemaGeneratorTarget } from '@oats-ts/json-schema-common'
/**
 * @param input The object (schema, operation, parameter, etc).
 * @param target The generator target (type definition, operation, etc).
 * @returns The desired path for the object based on target
 */
export type PathProvider = (input: any, target: string) => string

export type NameByTarget = Record<AsyncAPIGeneratorTarget, string>

export type AsyncAPIGeneratorTarget =
  | JsonSchemaGeneratorTarget
  | 'asyncapi/input-type'
  | 'asyncapi/query-type'
  | 'asyncapi/path-type'
  | 'asyncapi/channel-factory'
  | 'asyncapi/channel'
  | 'asyncapi/subscribe-type'
  | 'asyncapi/publish-type'
  | 'asyncapi/path-serializer'
  | 'asyncapi/api-type'
  | 'asyncapi/api-class'
  | 'asyncapi/api-stub'
