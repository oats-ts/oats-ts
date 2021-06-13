import { SchemaObject } from 'openapi3-ts'

export function getParameterSerializerMethod(schema: SchemaObject): 'primitive' | 'object' | 'array' {
  switch (schema.type) {
    case 'array':
      return 'array'
    case 'object':
      return 'object'
    case 'integer':
    case 'string':
    case 'number':
    case 'boolean':
      return 'primitive'
  }
}
