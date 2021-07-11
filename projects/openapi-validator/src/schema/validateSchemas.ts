import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { flatMap } from 'lodash'
import { validateSchema } from './validateSchema'

export function validateSchemas(
  schemas: (SchemaObject | ReferenceObject)[],
  context: OpenAPIGeneratorContext,
): Issue[] {
  const validated = new Set<SchemaObject>()
  return flatMap(schemas, (schema) => validateSchema(schema, context, validated))
}
