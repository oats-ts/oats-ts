import { SchemaObject } from 'openapi3-ts'

export type PrimitiveType = 'string' | 'number' | 'boolean'

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

export const PrimitiveTypes: SchemaObject['type'][] = ['boolean', 'string', 'number', 'integer']
