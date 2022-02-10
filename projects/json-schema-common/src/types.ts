import { GeneratorContext, HasSchemas } from '@oats-ts/model-common'

export type JsonSchemaGeneratorTarget = 'json-schema/type' | 'json-schema/type-guard' | 'json-schema/type-validator'

export type JsonSchemaGeneratorContext = GeneratorContext<HasSchemas, JsonSchemaGeneratorTarget>

export type InferredType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'enum'
  | 'literal'
  | 'object'
  | 'array'
  | 'tuple'
  | 'record'
  | 'union'
  | 'intersection'
  | 'unknown'
  | 'ref'
