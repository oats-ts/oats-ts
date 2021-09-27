import { SchemaObject } from '@oats-ts/json-schema-model'

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
