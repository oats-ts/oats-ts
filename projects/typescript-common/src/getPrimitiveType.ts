import { SchemaObject } from 'openapi3-ts'
import { PrimitiveType } from './typings'

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
