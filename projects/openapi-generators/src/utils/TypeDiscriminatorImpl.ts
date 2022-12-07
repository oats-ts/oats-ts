import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { getInferredType, isReferenceObject } from '@oats-ts/openapi-common'
import { TypeDiscriminator } from '../types'

export class TypeDiscriminatorImpl implements TypeDiscriminator {
  public isReferenceObject(schema: Referenceable<SchemaObject>): schema is ReferenceObject {
    return isReferenceObject(schema)
  }

  public isStringSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'string'
  }

  public isNumberSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'number'
  }

  public isBooleanSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'boolean'
  }

  public isUnionSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'union'
  }
  public isEnumSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'enum'
  }

  public isLiteralSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'literal'
  }
  public isIntersectionSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'intersection'
  }

  public isRecordSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'record'
  }

  public isObjectSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'object'
  }

  public isArraySchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'array'
  }

  public isTupleSchema(schema: SchemaObject): boolean {
    return getInferredType(schema) === 'tuple'
  }
}
