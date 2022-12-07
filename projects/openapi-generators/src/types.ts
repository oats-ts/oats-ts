import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { CodeGenerator, GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-common'
import { SourceFile } from 'typescript'

export type Config<T = {}> = boolean | (Partial<GeneratorConfig> & Partial<T>)

export type RootGeneratorConfig = GeneratorConfig & {
  name?: string
  children: OpenAPICodeGenerator | OpenAPICodeGenerator[]
}

export type OpenAPICodeGenerator = CodeGenerator<OpenAPIReadOutput, SourceFile>

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
