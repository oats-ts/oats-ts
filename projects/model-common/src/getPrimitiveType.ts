import { SchemaObject } from '@oats-ts/json-schema-model'
import { PrimitiveType } from './primitiveTypes'

export function getPrimitiveType(schema: SchemaObject): PrimitiveType {
  switch (schema.type) {
    case 'integer':
    case 'number':
      return 'number'
    case 'string':
      return 'string'
    case 'boolean':
      return 'boolean'
  }
}
