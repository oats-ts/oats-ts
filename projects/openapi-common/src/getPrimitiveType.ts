import { SchemaObject } from '@oats-ts/json-schema-model'
import { PrimitiveType } from './primitiveTypes'

export function getPrimitiveType(schema: SchemaObject): PrimitiveType | undefined {
  switch (schema.type) {
    case 'integer':
    case 'number':
      return 'number'
    case 'string':
      return 'string'
    case 'boolean':
      return 'boolean'
    default:
      undefined
  }
}
