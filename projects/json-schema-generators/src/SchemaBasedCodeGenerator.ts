import { sortBy } from 'lodash'
import { BaseCodeGenerator } from '@oats-ts/oats-ts'
import { SourceFile } from 'typescript'
import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import {
  createGeneratorContext,
  getInferredType,
  getNamedSchemas,
  HasSchemas,
  isReferenceObject,
  ReadOutput,
} from '@oats-ts/model-common'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget } from './types'

export abstract class SchemaBasedCodeGenerator<T extends ReadOutput<HasSchemas>, Cfg> extends BaseCodeGenerator<
  T,
  SourceFile,
  Cfg,
  Referenceable<SchemaObject>,
  JsonSchemaGeneratorContext
> {
  public abstract name(): JsonSchemaGeneratorTarget
  public abstract consumes(): JsonSchemaGeneratorTarget[]

  protected createContext(): JsonSchemaGeneratorContext {
    return createGeneratorContext(this, this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): Referenceable<SchemaObject>[] {
    return sortBy(getNamedSchemas(this.context), (schema) => this.context.nameOf(schema, this.name()))
  }

  protected isReferenceObject(schema: Referenceable<SchemaObject>): schema is ReferenceObject {
    return isReferenceObject(schema)
  }

  protected isStringSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'string'
  }

  protected isNumberSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'number'
  }

  protected isBooleanSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'boolean'
  }

  protected isUnionSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'union'
  }
  protected isEnumSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'enum'
  }

  protected isLiteralSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'literal'
  }
  protected isIntersectionSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'intersection'
  }

  protected isRecordSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'record'
  }

  protected isObjectSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'object'
  }

  protected isArraySchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'array'
  }

  protected isTupleSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'tuple'
  }
}
