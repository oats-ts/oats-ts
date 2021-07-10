import { isNil, values } from 'lodash'
import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from './typings'

/* TODO prevent recursion */
function collectNamedTypesForSchema(
  input: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  schemas: Set<SchemaObject>,
) {
  const { dereference, nameOf } = context
  if (isNil(input)) {
    return
  }

  const schema = isReferenceObject(input) ? dereference<SchemaObject>(input) : input

  if (schemas.has(schema)) {
    return
  }

  if (!isNil(nameOf(schema, 'openapi/type'))) {
    schemas.add(schema)
  }

  // TODO not, allOf etc will not be needed for generation
  const { additionalProperties, items, oneOf, properties } = schema

  if (typeof additionalProperties !== 'boolean') {
    collectNamedTypesForSchema(additionalProperties, context, schemas)
  }
  collectNamedTypesForSchema(items, context, schemas)

  for (const schema of values(properties || {})) {
    collectNamedTypesForSchema(schema, context, schemas)
  }

  for (const schema of oneOf || []) {
    collectNamedTypesForSchema(schema, context, schemas)
  }
}

export function getNamedSchemas(context: OpenAPIGeneratorContext): SchemaObject[] {
  const { document } = context
  const schemaSet = new Set<SchemaObject>()

  for (const schema of values(document?.components?.schemas || {})) {
    collectNamedTypesForSchema(schema, context, schemaSet)
  }

  return Array.from(schemaSet)
}
