import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { ReadOutput, HasSchemas, JsonSchemaBasedGeneratorContext } from '@oats-ts/model-common'

export type JsonSchemaGeneratorTarget = 'oats/type' | 'oats/type-guard' | 'oats/type-validator'

export type JsonSchemaGeneratorContext = JsonSchemaBasedGeneratorContext<HasSchemas, JsonSchemaGeneratorTarget>

export type JsonSchemaReadOutput = ReadOutput<HasSchemas>

export type TraversalHelper = {
  uriOf<T>(input: T): string | undefined
  parent<T, P>(input: T): P | undefined
  nameOf<T>(input: T, target: string): string
}

export type TypeDiscriminator = {
  isReferenceObject(schema: Referenceable<SchemaObject>): schema is ReferenceObject
  isStringSchema(schema: SchemaObject): boolean
  isNumberSchema(schema: SchemaObject): boolean
  isBooleanSchema(schema: SchemaObject): boolean
  isUnionSchema(schema: SchemaObject): boolean
  isEnumSchema(schema: SchemaObject): boolean
  isLiteralSchema(schema: SchemaObject): boolean
  isIntersectionSchema(schema: SchemaObject): boolean
  isRecordSchema(schema: SchemaObject): boolean
  isObjectSchema(schema: SchemaObject): boolean
  isArraySchema(schema: SchemaObject): boolean
  isTupleSchema(schema: SchemaObject): boolean
}
