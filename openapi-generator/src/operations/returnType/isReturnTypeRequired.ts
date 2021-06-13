import { isNil } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'

export function isReturnTypeRequired(schemas: SchemaObject[], context: OpenAPIGeneratorContext): boolean {
  const { accessor } = context
  if (schemas.length === 0) {
    return false
  }
  if (schemas.length === 1) {
    const [schema] = schemas
    // No need to generate type for primitive
    if (
      schema.type === 'string' ||
      schema.type === 'number' ||
      schema.type === 'integer' ||
      schema.type === 'boolean'
    ) {
      return false
    }
    if (!isNil(accessor.name(schema, 'type'))) {
      return false
    }
  }
  return true
}
